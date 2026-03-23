// ============================================
// PÁGINA "MIS PEDIDOS" — Historial de compras
// ============================================
// URL: /mis-pedidos
//
// Muestra todas las órdenes del usuario logueado,
// ordenadas por fecha (más reciente primero).
// Cada orden muestra: número, fecha, estado, total,
// y los productos que incluye.
// ============================================

import Link from "next/link";
import { auth } from "@/lib/auth";
import { getMyOrders } from "@/actions/orders";
import { formatPrice, timeAgo } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import type { Metadata } from "next";
import {
    Package,
    ShoppingBag,
    ArrowRight,
    ChevronRight,
    Clock,
    Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
    title: "Mis pedidos",
};

export default async function MisPedidosPage() {
    // Verificar que esté logueado
    const session = await auth();
    if (!session?.user) {
        return (
            <div className="bg-[#FAFAF9] min-h-screen">
                <div className="container mx-auto px-4 py-16 text-center max-w-md">
                    <Package className="h-16 w-16 text-zinc-200 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-zinc-900">Mis pedidos</h1>
                    <p className="text-zinc-500 mt-2">Iniciá sesión para ver tus pedidos.</p>
                    <Link href="/login">
                        <Button className="mt-6 bg-amber-500 hover:bg-amber-600 text-white rounded-xl">
                            Iniciar sesión
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Obtener pedidos del usuario
    const { orders } = await getMyOrders();

    return (
        <div className="bg-[#FAFAF9] min-h-screen">
            <div className="container mx-auto px-4 py-6 max-w-4xl">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
                    <Link href="/" className="hover:text-zinc-900 transition">Inicio</Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="text-zinc-900 font-medium">Mis pedidos</span>
                </div>

                <h1 className="text-2xl font-bold text-zinc-900 mb-6">
                    Mis pedidos
                    {orders.length > 0 && (
                        <span className="text-zinc-400 font-normal text-lg ml-2">({orders.length})</span>
                    )}
                </h1>

                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-md transition-shadow">

                                {/* Header de la orden */}
                                <div className="p-4 md:p-5 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-4 flex-wrap">
                                        {/* Número de orden */}
                                        <div>
                                            <p className="text-xs text-zinc-500">Orden</p>
                                            <p className="text-sm font-bold text-zinc-900">{order.orderNumber}</p>
                                        </div>

                                        {/* Fecha */}
                                        <div>
                                            <p className="text-xs text-zinc-500">Fecha</p>
                                            <p className="text-sm text-zinc-700">{timeAgo(new Date(order.createdAt))}</p>
                                        </div>

                                        {/* Tienda */}
                                        <div className="flex items-center gap-1.5">
                                            <Store className="h-3.5 w-3.5 text-zinc-400" />
                                            <span className="text-sm text-zinc-600">{order.store.name}</span>
                                        </div>
                                    </div>

                                    {/* Estado + Total */}
                                    <div className="flex items-center gap-3">
                                        <Badge className={`${ORDER_STATUS_COLORS[order.status] || "bg-zinc-100 text-zinc-700"} text-xs font-semibold px-3 py-1`}>
                                            {ORDER_STATUS_LABELS[order.status] || order.status}
                                        </Badge>
                                        <span className="text-lg font-extrabold text-zinc-900">
                                            {formatPrice(order.total)}
                                        </span>
                                    </div>
                                </div>

                                {/* Items de la orden */}
                                <div className="p-4 md:p-5">
                                    <div className="flex gap-3 overflow-x-auto">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 shrink-0">
                                                {/* Thumbnail del producto */}
                                                <div className="w-14 h-14 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        <ShoppingBag className="h-5 w-5 text-zinc-300" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-zinc-700 font-medium truncate max-w-[200px]">{item.name}</p>
                                                    <p className="text-xs text-zinc-500">
                                                        {item.quantity}x {formatPrice(item.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desglose rápido */}
                                    <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                                        <div className="flex gap-4">
                                            <span>Subtotal: {formatPrice(order.subtotal)}</span>
                                            <span>ISV: {formatPrice(order.tax)}</span>
                                            <span>Envío: {order.shippingCost === 0 ? "Gratis" : formatPrice(order.shippingCost)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-zinc-400">
                                            <Clock className="h-3 w-3" />
                                            <span>{new Date(order.createdAt).toLocaleDateString("es-HN", { year: "numeric", month: "short", day: "numeric" })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Estado vacío */
                    <div className="text-center py-16 max-w-md mx-auto">
                        <div className="bg-zinc-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="h-10 w-10 text-zinc-400" />
                        </div>
                        <h2 className="text-xl font-bold text-zinc-900">No tenés pedidos aún</h2>
                        <p className="text-zinc-500 mt-2">
                            Explorá nuestros productos y hacé tu primera compra.
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