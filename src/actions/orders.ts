// ============================================
// SERVER ACTIONS DE ÓRDENES
// ============================================
// Funciones para crear y gestionar pedidos.
//
// createOrder: toma los items del carrito del usuario,
// crea una orden con dirección + método de pago,
// calcula ISV y comisión, y vacía el carrito.
// ============================================

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { generateOrderNumber } from "@/lib/utils";
import { z } from "zod";

// ============================================
// SCHEMA DE VALIDACIÓN PARA LA DIRECCIÓN
// ============================================
const addressSchema = z.object({
    fullName: z.string().min(2, "Nombre requerido"),
    phone: z.string().min(8, "Teléfono requerido"),
    department: z.string().min(1, "Departamento requerido"),
    city: z.string().min(1, "Ciudad requerida"),
    colony: z.string().min(1, "Colonia requerida"),
    address: z.string().min(5, "Dirección requerida"),
    reference: z.string().optional(),
});

// ============================================
// CREAR ORDEN
// ============================================
// Recibe: dirección de envío + método de pago
// Proceso:
//   1. Obtener carrito del usuario
//   2. Validar que hay items y stock
//   3. Crear o reusar dirección
//   4. Calcular subtotal, ISV (15%), comisión (8%), total
//   5. Crear la orden + order items
//   6. Vaciar el carrito
//   7. Devolver el número de orden
export async function createOrder(formData: FormData) {
    try {
        // Verificar sesión
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, message: "Debés iniciar sesión" };
        }

        // Leer datos del formulario
        const rawAddress = {
            fullName: formData.get("fullName") as string,
            phone: formData.get("phone") as string,
            department: formData.get("department") as string,
            city: formData.get("city") as string,
            colony: formData.get("colony") as string,
            address: formData.get("address") as string,
            reference: (formData.get("reference") as string) || undefined,
        };
        const paymentMethod = formData.get("paymentMethod") as string;

        // Validar dirección
        const validatedAddress = addressSchema.safeParse(rawAddress);
        if (!validatedAddress.success) {
            return { success: false, message: validatedAddress.error.errors[0].message };
        }

        // Validar método de pago
        const validMethods = ["CARD", "BANK_TRANSFER", "TIGO_MONEY", "CASH_ON_DELIVERY"];
        if (!validMethods.includes(paymentMethod)) {
            return { success: false, message: "Método de pago no válido" };
        }

        // Obtener carrito con productos
        const cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                stock: true,
                                images: true,
                                isActive: true,
                                storeId: true,
                                store: { select: { commission: true } },
                            },
                        },
                    },
                },
            },
        });

        if (!cart || cart.items.length === 0) {
            return { success: false, message: "Tu carrito está vacío" };
        }

        // Filtrar items válidos y verificar stock
        const validItems = cart.items.filter((item) => item.product.isActive);
        if (validItems.length === 0) {
            return { success: false, message: "Los productos de tu carrito ya no están disponibles" };
        }

        for (const item of validItems) {
            if (item.quantity > item.product.stock) {
                return {
                    success: false,
                    message: `"${item.product.name}" solo tiene ${item.product.stock} unidades disponibles`,
                };
            }
        }

        // Calcular totales
        const subtotal = validItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity, 0
        );
        const taxRate = 0.15; // ISV Honduras 15%
        const tax = Math.round(subtotal * taxRate * 100) / 100;
        const shippingCost = subtotal >= 2000 ? 0 : 150; // Envío gratis arriba de L 2,000
        const total = Math.round((subtotal + tax + shippingCost) * 100) / 100;

        // Comisión del marketplace (usar la de la tienda o 8% default)
        const commissionRate = validItems[0].product.store.commission / 100;
        const commission = Math.round(subtotal * commissionRate * 100) / 100;
        const sellerAmount = Math.round((total - commission) * 100) / 100;

        // Obtener storeId (por ahora asumimos que todos los items son de la misma tienda)
        const storeId = validItems[0].product.storeId;

        // Crear la dirección en la DB
        const address = await prisma.address.create({
            data: {
                userId: session.user.id,
                ...validatedAddress.data,
                reference: validatedAddress.data.reference || "",
            },
        });

        // Determinar estado inicial según método de pago
        // CARD: se confirma después con Stripe (por ahora PENDING)
        // BANK_TRANSFER / TIGO_MONEY: esperando comprobante
        // CASH_ON_DELIVERY: se cobra al entregar
        const initialStatus = paymentMethod === "CASH_ON_DELIVERY"
            ? "CONFIRMED"
            : paymentMethod === "CARD"
                ? "PENDING"
                : "PENDING_PAYMENT";

        // Crear la orden
        const order = await prisma.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                userId: session.user.id,
                storeId,
                addressId: address.id,
                status: initialStatus,
                paymentMethod: paymentMethod as "CARD" | "BANK_TRANSFER" | "TIGO_MONEY" | "CASH_ON_DELIVERY",
                subtotal,
                shippingCost,
                tax,
                total,
                commission,
                sellerAmount,
                // Crear los items de la orden
                items: {
                    create: validItems.map((item) => ({
                        productId: item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                        quantity: item.quantity,
                        image: item.product.images[0] || null,
                    })),
                },
            },
        });

        // Descontar stock de cada producto
        for (const item of validItems) {
            await prisma.product.update({
                where: { id: item.product.id },
                data: {
                    stock: { decrement: item.quantity },
                    totalSales: { increment: item.quantity },
                },
            });
        }

        // Actualizar ventas de la tienda
        const totalItemsSold = validItems.reduce((sum, item) => sum + item.quantity, 0);
        await prisma.store.update({
            where: { id: storeId },
            data: { totalSales: { increment: totalItemsSold } },
        });

        // Vaciar el carrito
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });

        // Crear notificación para el vendedor
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: { userId: true, name: true },
        });

        if (store) {
            await prisma.notification.create({
                data: {
                    userId: store.userId,
                    type: "ORDER_NEW",
                    title: "¡Nueva orden recibida!",
                    message: `Recibiste un pedido por ${validItems.length} producto(s) — Total: L ${total.toFixed(2)}`,
                    link: `/seller/pedidos`,
                },
            });
        }

        revalidatePath("/carrito");
        revalidatePath("/mis-pedidos");

        return {
            success: true,
            message: "¡Orden creada exitosamente!",
            orderNumber: order.orderNumber,
            orderId: order.id,
        };
    } catch (error) {
        console.error("Error al crear orden:", error);
        return { success: false, message: "Error al procesar tu pedido. Intentá de nuevo." };
    }
}

// ============================================
// OBTENER PEDIDOS DEL USUARIO
// ============================================
export async function getMyOrders() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, orders: [] };

        const orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            include: {
                items: true,
                store: { select: { name: true, slug: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return { success: true, orders };
    } catch (error) {
        console.error("Error al obtener pedidos:", error);
        return { success: false, orders: [] };
    }
}