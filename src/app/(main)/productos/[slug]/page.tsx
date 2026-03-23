// ============================================
// PÁGINA DE DETALLE — ACTUALIZADA CON CARRITO
// ============================================
// Cambio: el botón "Agregar al carrito" ahora es un
// componente client (AddToCartButton) que realmente
// agrega el producto al carrito en la DB.
// ============================================

import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/actions/products";
import { formatPrice } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import type { Metadata } from "next";
import {
    Star,
    Truck,
    Shield,
    Heart,
    ChevronRight,
    Store,
    RotateCcw,
    ShoppingBag,
    MessageCircle,
    Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const { product } = await getProductBySlug(slug);
    if (!product) return { title: "Producto no encontrado" };
    return {
        title: product.name,
        description: product.description.slice(0, 160),
    };
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const { success, product } = await getProductBySlug(slug);

    if (!success || !product) notFound();

    const discount = product.comparePrice
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        `¡Mirá este producto en ${APP_NAME}! 🛒\n${product.name}\nhttps://mimercado.com/productos/${product.slug}`
    )}`;

    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;

    return (
        <div className="bg-[#FAFAF9] min-h-screen">
            <div className="container mx-auto px-4 py-6">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
                    <Link href="/" className="hover:text-zinc-900 transition">Inicio</Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <Link href="/productos" className="hover:text-zinc-900 transition">Productos</Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <Link href={`/productos?categoria=${product.category.slug}`} className="hover:text-zinc-900 transition">
                        {product.category.name}
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="text-zinc-900 font-medium truncate max-w-[200px]">{product.name}</span>
                </nav>

                {/* Layout: Imagen + Info */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* Imagen */}
                    <div>
                        <div className="aspect-square bg-white rounded-2xl border border-zinc-100 flex items-center justify-center overflow-hidden relative">
                            {product.images[0] ? (
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <ShoppingBag className="h-24 w-24 text-zinc-200" />
                                    <span className="text-sm text-zinc-400">Imagen del producto</span>
                                </div>
                            )}
                            {discount > 0 && (
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg shadow-red-500/30">
                                    -{discount}% OFF
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`w-20 h-20 rounded-xl border-2 flex items-center justify-center bg-white cursor-pointer transition ${i === 1 ? "border-amber-400" : "border-zinc-100 hover:border-zinc-300"}`}>
                                    <ShoppingBag className="h-6 w-6 text-zinc-200" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div>
                        <Link href={`/productos?categoria=${product.category.slug}`} className="text-sm text-amber-600 font-medium hover:text-amber-700 transition">
                            {product.category.name}
                        </Link>

                        <h1 className="mt-2 text-2xl lg:text-3xl font-bold text-zinc-900 leading-tight">{product.name}</h1>

                        {/* Rating */}
                        <div className="mt-3 flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < fullStars ? "fill-amber-400 text-amber-400" : i === fullStars && hasHalfStar ? "fill-amber-200 text-amber-400" : "fill-zinc-200 text-zinc-200"}`} />
                                ))}
                                <span className="text-sm font-semibold text-zinc-700 ml-1">{product.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-zinc-300">|</span>
                            <span className="text-sm text-zinc-500">{product.totalReviews} reviews</span>
                            <span className="text-zinc-300">|</span>
                            <span className="text-sm text-zinc-500">{product.totalSales}+ vendidos</span>
                        </div>

                        {/* Precio */}
                        <div className="mt-5 bg-white rounded-2xl border border-zinc-100 p-5">
                            <div className="flex items-end gap-3">
                                <span className="text-4xl font-extrabold text-zinc-900 tracking-tight">{formatPrice(product.price)}</span>
                                {product.comparePrice && (
                                    <span className="text-lg text-zinc-400 line-through mb-1">{formatPrice(product.comparePrice)}</span>
                                )}
                                {discount > 0 && (
                                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 mb-1">
                                        Ahorrás {formatPrice(product.comparePrice! - product.price)}
                                    </Badge>
                                )}
                            </div>
                            <p className="mt-2 text-xs text-zinc-400">Precio incluye ISV. Envío calculado al checkout.</p>
                        </div>

                        {/* Stock */}
                        <div className="mt-4 flex items-center gap-2">
                            {product.stock > 0 ? (
                                <>
                                    <Check className="h-4 w-4 text-emerald-500" />
                                    <span className="text-sm font-medium text-emerald-700">
                                        En stock — {product.stock > 10 ? "Disponible" : `Solo quedan ${product.stock}`}
                                    </span>
                                </>
                            ) : (
                                <span className="text-sm font-medium text-red-600">Agotado</span>
                            )}
                        </div>

                        {/* Botones de acción */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            {/* BOTÓN AGREGAR AL CARRITO — ahora funciona de verdad */}
                            <AddToCartButton productId={product.id} stock={product.stock} />

                            <Button size="lg" variant="outline" className="rounded-xl h-13 border-zinc-200 hover:border-red-300 hover:text-red-500 transition-colors">
                                <Heart className="h-5 w-5" />
                            </Button>

                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                <Button size="lg" variant="outline" className="rounded-xl h-13 border-zinc-200 hover:border-green-300 hover:text-green-600 transition-colors w-full sm:w-auto">
                                    <MessageCircle className="h-5 w-5" />
                                </Button>
                            </a>
                        </div>

                        {/* Beneficios */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex items-center gap-3 bg-white rounded-xl border border-zinc-100 p-3">
                                <Truck className="h-5 w-5 text-amber-500 shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-zinc-900">Envío a todo HN</p>
                                    <p className="text-[10px] text-zinc-500">24-72 horas</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white rounded-xl border border-zinc-100 p-3">
                                <Shield className="h-5 w-5 text-emerald-500 shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-zinc-900">Compra segura</p>
                                    <p className="text-[10px] text-zinc-500">Protección total</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white rounded-xl border border-zinc-100 p-3">
                                <RotateCcw className="h-5 w-5 text-blue-500 shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-zinc-900">Devolución</p>
                                    <p className="text-[10px] text-zinc-500">30 días gratis</p>
                                </div>
                            </div>
                        </div>

                        {/* Tienda */}
                        <div className="mt-6 bg-white rounded-2xl border border-zinc-100 p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                                        <Store className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900">{product.store.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                            <span className="text-xs font-semibold text-zinc-700">{product.store.rating.toFixed(1)}</span>
                                            <span className="text-xs text-zinc-400">·</span>
                                            <span className="text-xs text-zinc-500">{product.store.totalSales} ventas</span>
                                        </div>
                                    </div>
                                </div>
                                <Link href={`/tienda/${product.store.slug}`}>
                                    <Button variant="outline" size="sm" className="rounded-lg text-xs">Ver tienda</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Descripción */}
                <div className="mt-12">
                    <h2 className="text-xl font-bold text-zinc-900 mb-4">Descripción del producto</h2>
                    <div className="bg-white rounded-2xl border border-zinc-100 p-6 lg:p-8">
                        <p className="text-zinc-700 leading-relaxed whitespace-pre-line">{product.description}</p>
                    </div>
                </div>

                {/* Reviews */}
                <div className="mt-12">
                    <h2 className="text-xl font-bold text-zinc-900 mb-6">
                        Opiniones de compradores ({product.totalReviews})
                    </h2>

                    {product.reviews && product.reviews.length > 0 ? (
                        <div className="space-y-4">
                            {product.reviews.map((review) => (
                                <div key={review.id} className="bg-white rounded-2xl border border-zinc-100 p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        {review.user.image ? (
                                            <img src={review.user.image} alt="" className="h-8 w-8 rounded-full" />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center">
                                                <span className="text-xs font-bold text-zinc-500">{review.user.name?.[0]?.toUpperCase() || "U"}</span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-900">{review.user.name || "Usuario"}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200"}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {review.comment && <p className="text-sm text-zinc-600 leading-relaxed">{review.comment}</p>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-zinc-100 p-8 text-center">
                            <MessageCircle className="h-10 w-10 text-zinc-200 mx-auto mb-3" />
                            <p className="text-sm text-zinc-500">Este producto aún no tiene reviews. ¡Sé el primero en opinar!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}