// ============================================
// PRODUCT CARD - TARJETA DE PRODUCTO REUTILIZABLE
// ============================================
// Este componente se usa en TODAS partes donde se muestran
// productos: homepage, catálogo, búsqueda, página de tienda, etc.
//
// Muestra: imagen, badge de descuento, nombre (máx 2 líneas),
// precio actual + precio anterior tachado, rating con estrellas,
// y nombre de la tienda.
//
// Props: recibe un objeto "product" con los datos del producto.
// No importa de dónde vengan los datos — la card solo los muestra.
// ============================================

import Link from "next/link";
import { Star, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

// Definición de los datos que necesita la card
// El "?" significa que ese campo es opcional
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;  // Precio anterior (para calcular descuento)
    images: string[];               // Array de URLs de imágenes
    rating: number;                 // Promedio de estrellas (0-5)
    totalReviews: number;           // Cantidad de reviews
    store?: {                       // Info de la tienda (opcional)
      name: string;
    } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  // Calcular porcentaje de descuento si hay precio anterior
  // Ejemplo: precio actual 850, precio anterior 1000 → descuento = 15%
  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  return (
    // Link que envuelve toda la card — al hacer clic va al detalle del producto
    <Link href={`/productos/${product.slug}`} className="group block">
      <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow duration-200">

        {/* ========================================
            IMAGEN DEL PRODUCTO
            Aspect ratio cuadrado (aspect-square).
            Si no hay imagen, muestra un ícono placeholder.
            Al pasar el mouse, la imagen hace zoom (scale-105).
            ======================================== */}
        <div className="aspect-square bg-zinc-100 relative overflow-hidden">
          {product.images[0] ? (
            // Si tiene imagen, la muestra
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            // Si NO tiene imagen, muestra un ícono de placeholder
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-zinc-300" />
            </div>
          )}

          {/* Badge de descuento — solo se muestra si hay descuento */}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* ========================================
            INFO DEL PRODUCTO
            Nombre, precio, rating, y tienda
            ======================================== */}
        <div className="p-3">
          {/* Nombre — máximo 2 líneas, después corta con "..." */}
          <h3 className="text-sm text-zinc-700 line-clamp-2 group-hover:text-zinc-900 transition min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Precios */}
          <div className="mt-2 flex items-baseline gap-2">
            {/* Precio actual — grande y bold */}
            <span className="text-lg font-bold text-zinc-900">
              {formatPrice(product.price)}
            </span>

            {/* Precio anterior — tachado, solo si hay comparePrice */}
            {product.comparePrice && (
              <span className="text-sm text-zinc-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Rating — estrellas amarillas + número + cantidad de reviews */}
          {product.rating > 0 && (
            <div className="mt-1 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs text-zinc-600">
                {product.rating.toFixed(1)} ({product.totalReviews})
              </span>
            </div>
          )}

          {/* Nombre de la tienda — texto pequeño gris */}
          {product.store && (
            <p className="mt-1 text-xs text-zinc-400">
              por {product.store.name}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
