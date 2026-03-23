// ============================================
// HOMEPAGE — DISEÑO PREMIUM NIVEL MUNDIAL
// ============================================
// Inspirado en: Shopee, Mercado Libre, Apple Store, Nike
// 
// Características:
// - Gradientes premium con efecto glassmorphism
// - Animaciones CSS suaves (fade-in, slide-up)
// - Responsive perfecto: mobile, tablet, desktop
// - Cards con micro-interacciones al hover
// - Paleta de colores: negro profundo + dorado/amber + blanco limpio
// - Tipografía con pesos contrastantes
// ============================================

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME, INITIAL_CATEGORIES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Truck,
  Shield,
  CreditCard,
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
  Heart,
  Package,
  BadgeCheck,
  ChevronRight,
  Flame,
  Gift,
  Sparkles,
  Store,
  Zap,
  MapPin,
  Phone,
  Share2,
} from "lucide-react";

// ============================================
// PRODUCTOS DEMO — precios en Lempiras (HNL)
// ============================================
const featuredProducts = [
  { id: "1", name: "iPhone 15 Pro Max 256GB Titanio Natural", slug: "iphone-15-pro-max", price: 28999, comparePrice: 32999, rating: 4.8, reviews: 124, sold: 89, badge: "🔥 Más vendido", hot: true },
  { id: "2", name: "Samsung Galaxy S24 Ultra 512GB", slug: "samsung-galaxy-s24", price: 26499, comparePrice: 29999, rating: 4.7, reviews: 89, sold: 67, badge: null, hot: false },
  { id: "3", name: "AirPods Pro 2da Gen USB-C MagSafe", slug: "airpods-pro-2", price: 6999, comparePrice: 8499, rating: 4.9, reviews: 256, sold: 203, badge: "⭐ Top rated", hot: true },
  { id: "4", name: "Nike Air Max 90 Essential White", slug: "nike-air-max-90", price: 3499, comparePrice: 4299, rating: 4.6, reviews: 67, sold: 45, badge: null, hot: false },
  { id: "5", name: "MacBook Air M3 15\" 16GB 512GB", slug: "macbook-air-m3", price: 35999, comparePrice: 39999, rating: 4.9, reviews: 43, sold: 31, badge: "✨ Nuevo", hot: false },
  { id: "6", name: "Smart TV Samsung 55\" Crystal 4K", slug: "samsung-tv-55", price: 15999, comparePrice: 19999, rating: 4.7, reviews: 98, sold: 76, badge: null, hot: false },
  { id: "7", name: "PlayStation 5 Slim + DualSense", slug: "ps5-slim", price: 13499, comparePrice: 14999, rating: 4.9, reviews: 312, sold: 289, badge: "🔥 Más vendido", hot: true },
  { id: "8", name: "Dyson V15 Detect Aspiradora Pro", slug: "dyson-v15", price: 18999, comparePrice: 23999, rating: 4.6, reviews: 34, sold: 22, badge: null, hot: false },
];

const newProducts = [
  { id: "9", name: "JBL Charge 5 Bluetooth Resistente al Agua", slug: "jbl-charge-5", price: 3299, comparePrice: 3999, rating: 4.7, reviews: 156, sold: 134, badge: null, hot: false },
  { id: "10", name: "Kindle Paperwhite 11va Gen 16GB", slug: "kindle-paperwhite", price: 4599, comparePrice: 5299, rating: 4.8, reviews: 89, sold: 67, badge: "✨ Nuevo", hot: false },
  { id: "11", name: "Xiaomi Redmi Note 13 Pro 256GB", slug: "redmi-note-13", price: 7999, comparePrice: 9499, rating: 4.5, reviews: 201, sold: 178, badge: null, hot: false },
  { id: "12", name: "Instant Pot Duo 7-en-1 Olla 6Qt", slug: "instant-pot", price: 2499, comparePrice: 3299, rating: 4.8, reviews: 67, sold: 54, badge: null, hot: false },
];

// ============================================
// ESTILOS CSS PARA ANIMACIONES
// ============================================
// Se inyectan como <style> porque Next.js App Router
// no permite importar CSS en componentes client fácilmente.
const animationStyles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.15); }
    50% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.3); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  .animate-fade-up {
    animation: fadeUp 0.6s ease-out forwards;
  }
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }
  .stagger-1 { animation-delay: 50ms; }
  .stagger-2 { animation-delay: 100ms; }
  .stagger-3 { animation-delay: 150ms; }
  .stagger-4 { animation-delay: 200ms; }
  .stagger-5 { animation-delay: 250ms; }
  .stagger-6 { animation-delay: 300ms; }
  .stagger-7 { animation-delay: 350ms; }
  .stagger-8 { animation-delay: 400ms; }
  .shimmer-bg {
    background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.08) 50%, transparent 75%);
    background-size: 200% 100%;
    animation: shimmer 3s infinite;
  }
  .hover-lift {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .hover-lift:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
  }
  .card-shine {
    position: relative;
    overflow: hidden;
  }
  .card-shine::after {
    content: '';
    position: absolute;
    top: 0; left: -100%; width: 50%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
    transition: left 0.5s;
  }
  .card-shine:hover::after {
    left: 100%;
  }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

// ============================================
// COMPONENTE: TARJETA DE PRODUCTO PREMIUM
// ============================================
function PremiumCard({
  product,
  index,
}: {
  product: (typeof featuredProducts)[0];
  index: number;
}) {
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <Link
      href={`/productos/${product.slug}`}
      className={`group block animate-fade-up stagger-${index + 1}`}
    >
      <div className="hover-lift relative rounded-2xl overflow-hidden bg-white border border-zinc-100">

        {/* Imagen */}
        <div className="aspect-[4/5] bg-gradient-to-br from-zinc-50 via-white to-zinc-100 relative flex items-center justify-center overflow-hidden">
          {/* Ícono placeholder — se reemplaza con imagen real después */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <ShoppingBag className="h-10 w-10 text-zinc-300" />
            </div>
          </div>

          {/* Badge descuento */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-red-500/30">
              -{discount}%
            </div>
          )}

          {/* Badge especial */}
          {product.badge && (
            <div className="absolute top-3 right-3 bg-zinc-900/90 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1.5 rounded-full">
              {product.badge}
            </div>
          )}

          {/* Favorito — aparece al hover */}
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:scale-110"
          >
            <Heart className="h-4 w-4 text-zinc-500 hover:text-red-500 transition-colors" />
          </button>

          {/* Indicador "hot" — barra inferior animada */}
          {product.hot && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Nombre */}
          <h3 className="text-[13px] font-medium text-zinc-700 line-clamp-2 group-hover:text-zinc-900 transition leading-snug min-h-[2.4rem]">
            {product.name}
          </h3>

          {/* Rating + ventas */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-amber-700">{product.rating}</span>
            </div>
            <span className="text-[11px] text-zinc-400">{product.sold}+ vendidos</span>
          </div>

          {/* Precios */}
          <div className="mt-3 flex items-end gap-2">
            <span className="text-[22px] font-extrabold text-zinc-900 leading-none tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-zinc-400 line-through mb-0.5">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Envío gratis */}
          <div className="mt-2.5 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md">
            <Truck className="h-3 w-3" />
            <span className="text-[11px] font-semibold">Envío gratis</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================
// HOMEPAGE PRINCIPAL
// ============================================
export default function HomePage() {
  // Contador animado para las stats del hero
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {/* Inyectar estilos de animación */}
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />

      <div className="bg-[#FAFAF9]">

        {/* ========================================
            HERO — Diseño premium con doble columna
            Gradiente oscuro + stats + patrón
            ======================================== */}
        <section className="relative overflow-hidden bg-[#0A0A0B]">
          {/* Patrón de puntos sutil */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }} />

          {/* Glow dorado */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-amber-500/[0.07] rounded-full blur-[150px]" />

          {/* Líneas decorativas */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />

          <div className="container mx-auto px-4 py-14 md:py-20 lg:py-24 relative">
            <div className="grid lg:grid-cols-12 gap-12 items-center">

              {/* Texto principal — 7 columnas */}
              <div className="lg:col-span-7 animate-fade-up">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  La nueva forma de comprar en Honduras
                </div>

                {/* Título */}
                <h1 className="text-[2.75rem] md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-white">
                  Comprá lo que
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
                    querás, como
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
                    querás.
                  </span>
                </h1>

                {/* Descripción */}
                <p className="mt-6 text-base md:text-lg text-zinc-400 max-w-md leading-relaxed">
                  El primer marketplace hecho para vos. Miles de productos,
                  vendedores verificados, y la confianza de pagar como
                  prefieras.
                </p>

                {/* CTAs */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Link href="/productos">
                    <Button className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-900 font-bold px-8 h-13 text-base rounded-xl shadow-xl shadow-amber-500/20 transition-all hover:shadow-amber-500/40 hover:scale-[1.02] w-full sm:w-auto"
                      size="lg"
                    >
                      Explorar productos
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/vender">
                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-white/5 hover:border-zinc-500 h-13 text-base rounded-xl w-full sm:w-auto"
                      size="lg"
                    >
                      <Store className="mr-2 h-4 w-4" />
                      Abrí tu tienda
                    </Button>
                  </Link>
                </div>

                {/* Mini stats bajo los botones */}
                <div className="mt-10 flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 border-2 border-[#0A0A0B] flex items-center justify-center text-[10px] font-bold text-zinc-800">
                          {["K", "M", "J", "A"][i]}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-zinc-500">
                      <span className="text-white font-semibold">2,500+</span> compradores
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span><span className="text-white font-semibold">4.8</span> promedio</span>
                  </div>
                </div>
              </div>

              {/* Stats cards — 5 columnas */}
              <div className="lg:col-span-5 hidden lg:block animate-fade-up stagger-3">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Package, value: "10K+", label: "Productos", color: "from-amber-500/20 to-amber-500/5", iconColor: "text-amber-400" },
                    { icon: BadgeCheck, value: "500+", label: "Vendedores", color: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-400" },
                    { icon: MapPin, value: "18", label: "Departamentos", color: "from-blue-500/20 to-blue-500/5", iconColor: "text-blue-400" },
                    { icon: Shield, value: "100%", label: "Compra segura", color: "from-purple-500/20 to-purple-500/5", iconColor: "text-purple-400" },
                  ].map((stat, i) => (
                    <div key={i} className={`card-shine bg-gradient-to-br ${stat.color} border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm`}>
                      <stat.icon className={`h-7 w-7 ${stat.iconColor} mb-3`} />
                      <p className="text-2xl font-extrabold text-white tracking-tight">{stat.value}</p>
                      <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Transición suave hacia el contenido blanco */}
          <div className="h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        </section>

        {/* ========================================
            BARRA DE CONFIANZA
            ======================================== */}
        <section className="bg-white border-b border-zinc-100">
          <div className="container mx-auto px-4 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { icon: Truck, title: "Envío nacional", desc: "18 departamentos", bg: "bg-amber-50", color: "text-amber-600" },
                { icon: Shield, title: "Compra protegida", desc: "Devolución garantizada", bg: "bg-emerald-50", color: "text-emerald-600" },
                { icon: CreditCard, title: "Pagá a tu manera", desc: "Tarjeta, Tigo, efectivo", bg: "bg-blue-50", color: "text-blue-600" },
                { icon: Clock, title: "Entrega express", desc: "24-72h SPS y TGU", bg: "bg-violet-50", color: "text-violet-600" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`${item.bg} p-2.5 rounded-xl shrink-0`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                    <p className="text-[11px] text-zinc-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================
            CATEGORÍAS
            ======================================== */}
        <section className="container mx-auto px-4 pt-12 pb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900">Explorá por categoría</h2>
            <Link href="/productos" className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition">
              Ver todas <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-5 md:overflow-visible">
            {INITIAL_CATEGORIES.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/productos?categoria=${cat.slug}`}
                className={`flex-shrink-0 w-[120px] md:w-auto group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-zinc-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 transition-all duration-300 animate-fade-up stagger-${Math.min(i + 1, 8)}`}
              >
                <span className="text-3xl md:text-4xl group-hover:scale-125 transition-transform duration-300 group-hover:drop-shadow-sm">
                  {cat.emoji}
                </span>
                <span className="text-xs font-semibold text-zinc-600 group-hover:text-zinc-900 text-center transition">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ========================================
            PRODUCTOS DESTACADOS
            ======================================== */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-2.5 rounded-xl">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-zinc-900">Lo más popular</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Los productos que todos quieren</p>
              </div>
            </div>
            <Link href="/productos" className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition">
              Ver todos <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {featuredProducts.map((product, i) => (
              <PremiumCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>

        {/* ========================================
            BANNERS PROMOCIONALES — Doble
            ======================================== */}
        <section className="container mx-auto px-4 py-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Ofertas */}
            <Link href="/productos?oferta=true" className="group block">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-red-500 to-orange-500 p-7 md:p-8 text-white hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-full h-1 shimmer-bg" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
                    <Flame className="h-4 w-4" />
                    Solo por hoy
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">Hasta 40% OFF</h3>
                  <p className="mt-2 text-white/75 text-sm">En electrónica, hogar y más.</p>
                  <div className="mt-5 inline-flex items-center gap-2 bg-white text-red-600 font-bold text-sm px-4 py-2 rounded-full group-hover:shadow-lg transition">
                    Ver ofertas <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Nuevo usuario */}
            <Link href="/registro" className="group block">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-7 md:p-8 text-white hover:shadow-xl hover:shadow-zinc-900/30 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
                    <Gift className="h-4 w-4" />
                    Primera compra
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">Envío gratis + L100</h3>
                  <p className="mt-2 text-zinc-400 text-sm">Registrate y recibí tu descuento.</p>
                  <div className="mt-5 inline-flex items-center gap-2 bg-amber-500 text-zinc-900 font-bold text-sm px-4 py-2 rounded-full group-hover:shadow-lg group-hover:shadow-amber-500/25 transition">
                    Crear cuenta <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ========================================
            RECIÉN LLEGADOS
            ======================================== */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-2.5 rounded-xl">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-zinc-900">Recién llegados</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Lo más nuevo del marketplace</p>
              </div>
            </div>
            <Link href="/productos?orden=recientes" className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition">
              Ver más <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {newProducts.map((product, i) => (
              <PremiumCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>

        {/* ========================================
            CTA VENDEDORES — Sección oscura premium
            ======================================== */}
        <section className="relative overflow-hidden bg-[#0A0A0B] mt-12">
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/[0.05] rounded-full blur-[120px]" />

          <div className="container mx-auto px-4 py-20 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Zap className="h-4 w-4" />
                Oportunidad para emprendedores
              </div>

              <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                Vendé a miles de
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                  compradores en Honduras
                </span>
              </h2>

              <p className="mt-5 text-zinc-400 max-w-lg mx-auto leading-relaxed">
                Abrí tu tienda en minutos. Nosotros nos encargamos de los pagos, el soporte,
                y de llevar clientes a tu puerta.
              </p>

              <div className="mt-10">
                <Link href="/vender">
                  <Button className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-900 font-bold px-10 h-13 text-base rounded-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all"
                    size="lg"
                  >
                    Crear mi tienda gratis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Métricas */}
              <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: "0%", label: "comisión 3 meses" },
                  { value: "24h", label: "para empezar" },
                  { value: "4", label: "métodos de pago" },
                  { value: "∞", label: "productos gratis" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                    <p className="text-2xl font-extrabold text-amber-400 tracking-tight">{stat.value}</p>
                    <p className="text-[11px] text-zinc-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
            MÉTODOS DE PAGO — Confianza
            ======================================== */}
        <section className="bg-white border-t border-zinc-100">
          <div className="container mx-auto px-4 py-10 text-center">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-6">Pagá de forma segura</p>
            <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
              {[
                { icon: "💳", label: "Visa / MC" },
                { icon: "📱", label: "Tigo Money" },
                { icon: "🏦", label: "BAC / Ficohsa" },
                { icon: "💵", label: "Contra entrega" },
                { icon: "🔒", label: "SSL seguro" },
              ].map((method, i) => (
                <div key={i} className="flex items-center gap-2 text-zinc-400">
                  <span className="text-xl">{method.icon}</span>
                  <span className="text-xs font-medium">{method.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}