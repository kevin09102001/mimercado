// ============================================
// PÁGINA DEL CARRITO DE COMPRAS
// ============================================
// URL: /carrito
//
// Muestra todos los productos en el carrito del usuario:
//   - Imagen, nombre, precio de cada item
//   - Selector de cantidad (+ y -)
//   - Botón eliminar
//   - Subtotal por item
//   - Resumen: subtotal, ISV (15%), total
//   - Botón "Ir al checkout"
//
// Si el carrito está vacío, muestra un estado vacío
// con link para explorar productos.
// ============================================

import Link from "next/link";
import { getCart } from "@/actions/cart";
import { formatPrice } from "@/lib/utils";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import {
    ShoppingCart,
    ShoppingBag,
    ArrowRight,
    Truck,
    Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItemRow } from "@/components/cart/cart-item-row";

export const metadata: Metadata = {
    title: "Mi carrito",
};

export default async function CarritoPage() {
    // Verificar si el usuario está logueado
    const session = await auth();

    if (!session?.user) {
        return (
            <div className="bg-[#FAFAF9] min-h-screen">
                <div className="container mx-auto px-4 py-16 text-center max-w-md">
                    <ShoppingCart className="h-16 w-16 text-zinc-200 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-zinc-900">Tu carrito</h1>
                    <p className="text-zinc-500 mt-2">Iniciá sesión para ver tu carrito de compras.</p>
                    <Link href="/login">
                        <Button className="mt-6 bg-amber-500 hover:bg-amber-600 text-white rounded-xl">
                            Iniciar sesión
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Obtener el carrito del usuario
    const { cart } = await getCart();
    const items = cart?.items ?? [];

    // Filtrar items con productos activos
    const validItems = items.filter((item) => item.product.isActive);

    // Calcular totales
    const subtotal = validItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
    const tax = Math.round(subtotal * 0.15 * 100) / 100; // ISV 15%
    const shipping = subtotal >= 2000 ? 0 : 150; // Envío gratis arriba de L 2,000
    const total = subtotal + tax + shipping;

    return (
        <div className="bg-[#FAFAF9] min-h-screen">
            <div className="container mx-auto px-4 py-6">

                {/* Título */}
                <h1 className="text-2xl font-bold text-zinc-900 mb-6">
                    Mi carrito
                    {validItems.length > 0 && (
                        <span className="text-zinc-400 font-normal text-lg ml-2">
                            ({validItems.length} {validItems.length === 1 ? "producto" : "productos"})
                        </span>
                    )}
                </h1>

                {validItems.length > 0 ? (
                    <div className="grid lg:grid-cols-3 gap-6">

                        {/* ========================================
                COLUMNA IZQUIERDA — Items del carrito
                ======================================== */}
                        <div className="lg:col-span-2 space-y-3">
                            {validItems.map((item) => (
                                <CartItemRow
                                    key={item.id}
                                    item={{
                                        id: item.id,
                                        quantity: item.quantity,
                                        product: {
                                            id: item.product.id,
                                            name: item.product.name,
                                            slug: item.product.slug,
                                            price: item.product.price,
                                            comparePrice: item.product.comparePrice,
                                            images: item.product.images,
                                            stock: item.product.stock,
                                            storeName: item.product.store.name,
                                        },
                                    }}
                                />
                            ))}
                        </div>

                        {/* ========================================
                COLUMNA DERECHA — Resumen del pedido
                ======================================== */}
                        <div>
                            <div className="bg-white rounded-2xl border border-zinc-100 p-6 sticky top-28">
                                <h2 className="font-bold text-zinc-900 text-lg mb-4">
                                    Resumen del pedido
                                </h2>

                                {/* Desglose de costos */}
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">
                                            Subtotal ({validItems.length} {validItems.length === 1 ? "producto" : "productos"})
                                        </span>
                                        <span className="font-medium text-zinc-900">
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">ISV (15%)</span>
                                        <span className="font-medium text-zinc-900">
                                            {formatPrice(tax)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Envío</span>
                                        <span className={`font-medium ${shipping === 0 ? "text-emerald-600" : "text-zinc-900"}`}>
                                            {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                                        </span>
                                    </div>

                                    {/* Mensaje de envío gratis */}
                                    {shipping > 0 && (
                                        <div className="bg-amber-50 rounded-lg p-3 flex items-center gap-2">
                                            <Truck className="h-4 w-4 text-amber-600 shrink-0" />
                                            <p className="text-xs text-amber-700">
                                                Agregá {formatPrice(2000 - subtotal)} más para envío gratis
                                            </p>
                                        </div>
                                    )}

                                    {shipping === 0 && (
                                        <div className="bg-emerald-50 rounded-lg p-3 flex items-center gap-2">
                                            <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
                                            <p className="text-xs text-emerald-700 font-medium">
                                                ¡Tenés envío gratis!
                                            </p>
                                        </div>
                                    )}

                                    {/* Línea divisoria */}
                                    <div className="border-t border-zinc-100 pt-3">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-zinc-900 text-base">Total</span>
                                            <span className="font-extrabold text-zinc-900 text-xl">
                                                {formatPrice(total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón checkout */}
                                <Link href="/checkout">
                                    <Button className="w-full mt-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-900 font-bold rounded-xl h-12 text-base shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all">
                                        Ir al checkout
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>

                                {/* Seguridad */}
                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-400">
                                    <Shield className="h-3.5 w-3.5" />
                                    <span>Compra 100% segura y protegida</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ========================================
                       CARRITO VACÍO
                       ======================================== */
                    <div className="text-center py-16 max-w-md mx-auto">
                        <div className="bg-zinc-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="h-10 w-10 text-zinc-400" />
                        </div>
                        <h2 className="text-xl font-bold text-zinc-900">Tu carrito está vacío</h2>
                        <p className="text-zinc-500 mt-2">
                            Explorá nuestros productos y encontrá lo que buscás.
                        </p>
                        <Link href="/productos">
                            <Button className="mt-6 bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-8">
                                Explorar productos
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}