// ============================================
// PÁGINA DE CATÁLOGO — TODOS LOS PRODUCTOS
// ============================================
// URL: /productos
// URL con filtros: /productos?categoria=electronica&q=iphone&orden=precio-asc
//
// FIX: El select de ordenar usa links en vez de onChange
// porque esta es un Server Component (no puede tener event handlers).
// ============================================

import Link from "next/link";
import { getProducts, getCategories } from "@/actions/products";
import { formatPrice } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import type { Metadata } from "next";
import {
  ShoppingBag,
  Star,
  Truck,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
  Heart,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Productos",
  description: `Explorá miles de productos en ${APP_NAME}. Electrónica, ropa, hogar y más con envío a todo Honduras.`,
};

// Opciones de orden para los links
const ORDER_OPTIONS = [
  { value: "recientes", label: "Más recientes" },
  { value: "popular", label: "Más vendidos" },
  { value: "precio-asc", label: "Menor precio" },
  { value: "precio-desc", label: "Mayor precio" },
  { value: "rating", label: "Mejor calificados" },
];

// Función helper para construir la URL con filtros
function buildUrl(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  const qs = searchParams.toString();
  return `/productos${qs ? `?${qs}` : ""}`;
}

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const categoria = params.categoria;
  const q = params.q;
  const orden = params.orden || "recientes";
  const pagina = parseInt(params.pagina || "1");
  const oferta = params.oferta === "true";

  const [productResult, categoryResult] = await Promise.all([
    getProducts({ categoria, q, orden, pagina, oferta, limite: 12 }),
    getCategories(),
  ]);

  const { products, total, totalPages, currentPage } = productResult;
  const { categories } = categoryResult;

  // Label del orden actual
  const currentOrderLabel = ORDER_OPTIONS.find((o) => o.value === orden)?.label || "Más recientes";

  return (
    <div className="bg-[#FAFAF9] min-h-screen">
      <div className="container mx-auto px-4 py-6">

        {/* Encabezado */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-3">
            <Link href="/" className="hover:text-zinc-900 transition">Inicio</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">
              {categoria
                ? categories.find((c) => c.slug === categoria)?.name || "Productos"
                : q
                  ? `Resultados para "${q}"`
                  : oferta
                    ? "Ofertas"
                    : "Todos los productos"}
            </span>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">
                {categoria
                  ? categories.find((c) => c.slug === categoria)?.name
                  : q
                    ? `Resultados para "${q}"`
                    : oferta
                      ? "🔥 Ofertas"
                      : "Todos los productos"}
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                {total} {total === 1 ? "producto" : "productos"}
              </p>
            </div>

            {/* Selector de orden con LINKS (no onChange) */}
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
              {ORDER_OPTIONS.map((opt) => (
                <Link
                  key={opt.value}
                  href={buildUrl({ categoria, q, orden: opt.value, oferta: oferta ? "true" : undefined })}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${orden === opt.value
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                    }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="flex gap-6">

          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-zinc-100 p-5 sticky top-28">
              <h3 className="font-bold text-zinc-900 mb-4">Categorías</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/productos"
                    className={`block px-3 py-2 rounded-lg text-sm transition ${!categoria && !oferta
                      ? "bg-amber-50 text-amber-700 font-semibold"
                      : "text-zinc-600 hover:bg-zinc-50"
                      }`}
                  >
                    Todas
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/productos?categoria=${cat.slug}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition ${categoria === cat.slug
                        ? "bg-amber-50 text-amber-700 font-semibold"
                        : "text-zinc-600 hover:bg-zinc-50"
                        }`}
                    >
                      {cat.name}
                      <span className="text-zinc-400 ml-1">({cat._count.products})</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-zinc-100">
                <Link
                  href="/productos?oferta=true"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${oferta
                    ? "bg-red-50 text-red-700 font-semibold"
                    : "text-zinc-600 hover:bg-zinc-50"
                    }`}
                >
                  <Flame className="h-4 w-4" />
                  Solo ofertas
                </Link>
              </div>
            </div>
          </aside>

          {/* Grid de productos */}
          <div className="flex-1">
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {products.map((product) => {
                    const discount = product.comparePrice
                      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                      : 0;

                    return (
                      <Link key={product.id} href={`/productos/${product.slug}`} className="group block">
                        <div className="relative rounded-2xl overflow-hidden bg-white border border-zinc-100 hover:shadow-xl hover:shadow-zinc-200/50 hover:-translate-y-1 transition-all duration-300">
                          {/* Imagen */}
                          <div className="aspect-[4/5] bg-gradient-to-br from-zinc-50 to-zinc-100 relative flex items-center justify-center overflow-hidden">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                              <ShoppingBag className="h-10 w-10 text-zinc-300" />
                            </div>

                            {discount > 0 && (
                              <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-red-500/30">
                                -{discount}%
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="p-4">
                            <h3 className="text-[13px] font-medium text-zinc-700 line-clamp-2 group-hover:text-zinc-900 transition leading-snug min-h-[2.4rem]">
                              {product.name}
                            </h3>

                            <div className="mt-2.5 flex items-center gap-1.5">
                              <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span className="text-[11px] font-bold text-amber-700">{product.rating.toFixed(1)}</span>
                              </div>
                              <span className="text-[11px] text-zinc-400">{product.totalSales}+ vendidos</span>
                            </div>

                            <div className="mt-3 flex items-end gap-2">
                              <span className="text-xl font-extrabold text-zinc-900 leading-none tracking-tight">
                                {formatPrice(product.price)}
                              </span>
                              {product.comparePrice && (
                                <span className="text-xs text-zinc-400 line-through mb-0.5">
                                  {formatPrice(product.comparePrice)}
                                </span>
                              )}
                            </div>

                            <div className="mt-2.5 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md">
                              <Truck className="h-3 w-3" />
                              <span className="text-[11px] font-semibold">Envío gratis</span>
                            </div>

                            {product.store && (
                              <p className="mt-2 text-[11px] text-zinc-400">por {product.store.name}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    {currentPage > 1 && (
                      <Link href={buildUrl({ categoria, q, orden, oferta: oferta ? "true" : undefined, pagina: String(currentPage - 1) })}>
                        <Button variant="outline" size="sm" className="rounded-lg">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                      <Link key={page} href={buildUrl({ categoria, q, orden, oferta: oferta ? "true" : undefined, pagina: String(page) })}>
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className={`rounded-lg min-w-[36px] ${currentPage === page ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}`}
                        >
                          {page}
                        </Button>
                      </Link>
                    ))}

                    {currentPage < totalPages && (
                      <Link href={buildUrl({ categoria, q, orden, oferta: oferta ? "true" : undefined, pagina: String(currentPage + 1) })}>
                        <Button variant="outline" size="sm" className="rounded-lg">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <Search className="h-16 w-16 text-zinc-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-zinc-900">No se encontraron productos</h3>
                <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">
                  {q ? `No hay resultados para "${q}". Intentá con otra búsqueda.` : "No hay productos disponibles en esta categoría."}
                </p>
                <Link href="/productos">
                  <Button className="mt-6 bg-amber-500 hover:bg-amber-600 text-white rounded-xl">
                    Ver todos los productos
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}