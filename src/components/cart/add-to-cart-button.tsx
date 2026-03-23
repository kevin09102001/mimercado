// ============================================
// BOTÓN "AGREGAR AL CARRITO"
// ============================================
// Componente client que llama al Server Action addToCart.
// Muestra un botón con loading state y feedback visual.
//
// Se usa en la página de detalle del producto:
//   <AddToCartButton productId={product.id} stock={product.stock} />
//
// Es "use client" porque necesita useState para el loading
// y useRouter para refrescar la página después de agregar.
// ============================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/actions/cart";

interface AddToCartButtonProps {
    productId: string;   // ID del producto a agregar
    stock: number;       // Stock disponible (para deshabilitar si es 0)
}

export function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);    // Para mostrar "Agregado!" brevemente
    const [error, setError] = useState("");
    const router = useRouter();

    const handleAddToCart = async () => {
        setLoading(true);
        setError("");

        const result = await addToCart(productId, 1);

        if (result.success) {
            // Mostrar "Agregado!" por 2 segundos
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
            // Refrescar la página para actualizar el contador del header
            router.refresh();
        } else {
            setError(result.message);
            setTimeout(() => setError(""), 3000);
        }

        setLoading(false);
    };

    return (
        <div className="flex-1">
            <Button
                onClick={handleAddToCart}
                disabled={stock === 0 || loading}
                size="lg"
                className={`w-full rounded-xl h-13 text-base font-bold shadow-lg transition-all ${added
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                        : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-900 shadow-amber-500/20 hover:shadow-amber-500/40"
                    }`}
            >
                {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : added ? (
                    <>
                        <Check className="mr-2 h-5 w-5" />
                        ¡Agregado!
                    </>
                ) : stock === 0 ? (
                    "Agotado"
                ) : (
                    <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Agregar al carrito
                    </>
                )}
            </Button>

            {/* Mensaje de error */}
            {error && (
                <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
            )}
        </div>
    );
}