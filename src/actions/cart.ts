// ============================================
// SERVER ACTIONS DEL CARRITO DE COMPRAS
// ============================================
// Funciones del servidor para manejar el carrito.
// El carrito se guarda en la DB (persistente entre sesiones).
// Cada usuario tiene UN solo carrito (relación 1:1).
//
// Funciones:
//   - getCart: obtener el carrito del usuario actual
//   - addToCart: agregar un producto (o aumentar cantidad)
//   - updateCartItemQuantity: cambiar cantidad de un item
//   - removeFromCart: quitar un producto del carrito
//   - clearCart: vaciar todo el carrito
//   - getCartCount: obtener solo la cantidad total de items
// ============================================

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ============================================
// OBTENER EL CARRITO COMPLETO DEL USUARIO
// ============================================
// Devuelve todos los items del carrito con los datos
// del producto (nombre, precio, imagen, stock, tienda).
export async function getCart() {
    try {
        // Obtener la sesión del usuario actual
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, cart: null, message: "Debés iniciar sesión" };
        }

        // Buscar el carrito del usuario, incluyendo los productos
        const cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                price: true,
                                comparePrice: true,
                                images: true,
                                stock: true,
                                isActive: true,
                                store: {
                                    select: {
                                        name: true,
                                        slug: true,
                                    },
                                },
                            },
                        },
                    },
                    // Ordenar por fecha de agregado (más reciente primero)
                    orderBy: { id: "desc" },
                },
            },
        });

        return { success: true, cart };
    } catch (error) {
        console.error("Error al obtener carrito:", error);
        return { success: false, cart: null, message: "Error al cargar el carrito" };
    }
}

// ============================================
// AGREGAR PRODUCTO AL CARRITO
// ============================================
// Si el producto ya está en el carrito, aumenta la cantidad.
// Si no está, lo agrega con cantidad 1.
// Verifica que haya stock disponible.
export async function addToCart(productId: string, quantity: number = 1) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, message: "Debés iniciar sesión para agregar al carrito" };
        }

        // Verificar que el producto existe y tiene stock
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { id: true, stock: true, isActive: true, name: true },
        });

        if (!product || !product.isActive) {
            return { success: false, message: "Este producto no está disponible" };
        }

        if (product.stock < quantity) {
            return { success: false, message: `Solo hay ${product.stock} unidades disponibles` };
        }

        // Buscar o crear el carrito del usuario
        // upsert = "update or insert" — si existe lo actualiza, si no lo crea
        let cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: session.user.id },
            });
        }

        // Verificar si el producto ya está en el carrito
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });

        if (existingItem) {
            // Si ya existe, aumentar la cantidad
            const newQuantity = existingItem.quantity + quantity;

            // Verificar que no exceda el stock
            if (newQuantity > product.stock) {
                return { success: false, message: `Solo hay ${product.stock} unidades disponibles` };
            }

            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
            });
        } else {
            // Si no existe, crear nuevo item en el carrito
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
            });
        }

        // Revalidar las páginas que muestran el carrito
        revalidatePath("/carrito");
        revalidatePath("/productos");

        return { success: true, message: `${product.name} agregado al carrito` };
    } catch (error) {
        console.error("Error al agregar al carrito:", error);
        return { success: false, message: "Error al agregar al carrito" };
    }
}

// ============================================
// ACTUALIZAR CANTIDAD DE UN ITEM
// ============================================
// Cambia la cantidad de un producto en el carrito.
// Si la cantidad es 0 o menos, lo elimina.
export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, message: "Debés iniciar sesión" };
        }

        // Verificar que el item pertenece al usuario
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: {
                cart: { select: { userId: true } },
                product: { select: { stock: true } },
            },
        });

        if (!cartItem || cartItem.cart.userId !== session.user.id) {
            return { success: false, message: "Item no encontrado" };
        }

        // Si la cantidad es 0 o menos, eliminar el item
        if (quantity <= 0) {
            await prisma.cartItem.delete({ where: { id: cartItemId } });
            revalidatePath("/carrito");
            return { success: true, message: "Producto eliminado del carrito" };
        }

        // Verificar stock
        if (quantity > cartItem.product.stock) {
            return { success: false, message: `Solo hay ${cartItem.product.stock} unidades disponibles` };
        }

        // Actualizar cantidad
        await prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity },
        });

        revalidatePath("/carrito");
        return { success: true, message: "Cantidad actualizada" };
    } catch (error) {
        console.error("Error al actualizar cantidad:", error);
        return { success: false, message: "Error al actualizar" };
    }
}

// ============================================
// ELIMINAR UN PRODUCTO DEL CARRITO
// ============================================
export async function removeFromCart(cartItemId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, message: "Debés iniciar sesión" };
        }

        // Verificar que el item pertenece al usuario
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: { select: { userId: true } } },
        });

        if (!cartItem || cartItem.cart.userId !== session.user.id) {
            return { success: false, message: "Item no encontrado" };
        }

        await prisma.cartItem.delete({ where: { id: cartItemId } });

        revalidatePath("/carrito");
        return { success: true, message: "Producto eliminado del carrito" };
    } catch (error) {
        console.error("Error al eliminar del carrito:", error);
        return { success: false, message: "Error al eliminar" };
    }
}

// ============================================
// VACIAR TODO EL CARRITO
// ============================================
export async function clearCart() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, message: "Debés iniciar sesión" };
        }

        const cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
        });

        if (cart) {
            // Eliminar todos los items del carrito
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
        }

        revalidatePath("/carrito");
        return { success: true, message: "Carrito vaciado" };
    } catch (error) {
        console.error("Error al vaciar carrito:", error);
        return { success: false, message: "Error al vaciar el carrito" };
    }
}

// ============================================
// OBTENER CANTIDAD TOTAL DE ITEMS EN EL CARRITO
// ============================================
// Se usa para el badge del carrito en el header.
// Solo devuelve el número, no los datos completos.
export async function getCartCount() {
    try {
        const session = await auth();
        if (!session?.user?.id) return 0;

        const cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: {
                items: { select: { quantity: true } },
            },
        });

        if (!cart) return 0;

        // Sumar todas las cantidades
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    } catch {
        return 0;
    }
}