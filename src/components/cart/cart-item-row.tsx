// ============================================
// FILA DE ITEM DEL CARRITO
// ============================================
// Componente client que muestra un producto en el carrito.
// Permite:
//   - Ver la info del producto (nombre, precio, imagen)
//   - Cambiar cantidad con botones + y -
//   - Eliminar el item del carrito
//
// Es "use client" porque tiene interactividad
// (botones que llaman Server Actions).
// ============================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { updateCartItemQuantity, removeFromCart } from "@/actions/cart";

interface CartItemRowProps {
    item: {
        id: string;          // ID del CartItem (para actualizar/eliminar)
        quantity: number;     // Cantidad actual
        product: {
            id: string;
            name: string;
            slug: string;
            price: number;
            comparePrice: number | null;
            images: string[];
            stock: number;
            storeName: string;
        };
    };
}

export function CartItemRow({ item }: CartItemRowProps) {
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    // Subtotal de este item = precio × cantidad
    const subtotal = item.product.price * item.quantity;

    // --- CAMBIAR CANTIDAD ---
    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > item.product.stock) return;
        setLoading(true);
        await updateCartItemQuantity(item.id, newQuantity);
        router.refresh();
        setLoading(false);
    };

    // --- ELIMINAR ITEM ---
    const handleRemove = async () => {
        setDeleting(true);
        await removeFromCart(item.id);
        router.refresh();
    };

    return (
        <div className={`bg-white rounded-2xl border border-zinc-100 p-4 flex gap-4 transition-opacity ${deleting ? "opacity-50" : ""}`}>

            {/* Imagen del producto */}
            <Link href={`/productos/${item.product.slug}`} className="shrink-0">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-zinc-100 flex items-center justify-center overflow-hidden">
                    {item.product.images[0] ? (
                        <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <ShoppingBag className="h-8 w-8 text-zinc-300" />
                    )}
                </div>
            </Link>

            {/* Info del producto */}
            <div className="flex-1 min-w-0">
                {/* Nombre */}
                <Link href={`/productos/${item.product.slug}`}>
                    <h3 className="text-sm font-medium text-zinc-900 hover:text-amber-600 transition line-clamp-2">
                        {item.product.name}
                    </h3>
                </Link>

                {/* Tienda */}
                <p className="text-xs text-zinc-400 mt-1">por {item.product.storeName}</p>

                {/* Precio unitario */}
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-base font-bold text-zinc-900">
                        {formatPrice(item.product.price)}
                    </span>
                    {item.product.comparePrice && (
                        <span className="text-xs text-zinc-400 line-through">
                            {formatPrice(item.product.comparePrice)}
                        </span>
                    )}
                </div>

                {/* Controles: cantidad + eliminar */}
                <div className="mt-3 flex items-center justify-between">

                    {/* Selector de cantidad */}
                    <div className="flex items-center gap-1">
                        {/* Botón - (menos) */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            disabled={item.quantity <= 1 || loading}
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </Button>

                        {/* Cantidad actual */}
                        <div className="w-10 h-8 flex items-center justify-center text-sm font-semibold text-zinc-900">
                            {loading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400" />
                            ) : (
                                item.quantity
                            )}
                        </div>

                        {/* Botón + (más) */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock || loading}
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </Button>

                        {/* Indicador de stock bajo */}
                        {item.product.stock <= 5 && (
                            <span className="ml-2 text-[10px] text-orange-600 font-medium">
                                Solo {item.product.stock} disponibles
                            </span>
                        )}
                    </div>

                    {/* Subtotal + botón eliminar */}
                    <div className="flex items-center gap-3">
                        {/* Subtotal de este item */}
                        <span className="text-base font-bold text-zinc-900 hidden sm:block">
                            {formatPrice(subtotal)}
                        </span>

                        {/* Botón eliminar */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 transition"
                            onClick={handleRemove}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}