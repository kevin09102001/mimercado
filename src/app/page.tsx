// ============================================
// HOMEPAGE — CON PRODUCTOS REALES DE LA DB
// ============================================
// Cambio: en vez de productos demo hardcodeados,
// ahora carga productos reales de la base de datos
// usando el Server Action getProducts().
//
// Secciones:
//   1. Hero banner
//   2. Beneficios
//   3. Categorías
//   4. Productos destacados (isFeatured = true, desde DB)
//   5. Banners promocionales
//   6. Productos recientes (ordenados por fecha, desde DB)
//   7. CTA vendedores
//   8. Métodos de pago
// ============================================

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME, INITIAL_CATEGORIES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { getProducts } from "@/actions/products";
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
} from "lucide-react";

// Componente de tarjeta de producto para la homepage
function HomeProductCard({
  product,
}: {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    rating: number;
    totalReviews: number;
    totalSales: number;
    isFeatured: boolean;
    images: string[];
    store: { name: string } | null;
  };
}) {
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <Link href={`/productos/${product.slug}`} className="group block">
      <div className="relative rounded-2xl overflow-hidden bg-white border border-zinc-100 hover:shadow-xl hover:shadow-zinc-200/50 hover:-translate-y-1 transition-all duration-300">
        <div className="aspect-[4/5] bg-gradient-to-br from-zinc-50 to-zinc-100 relative flex items-center justify-center overflow-hidden">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <ShoppingBag className="h-10 w-10 text-zinc-300" />
          </div>
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-red-500/30">
              -{discount}%
            </div>
          )}
          {product.totalSales > 80 && (
            <div className="absolute top-3 right-3 bg-zinc-900/90 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1.5 rounded-full">
              🔥 Más vendido
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-[13px] font-medium text-zinc-700 line-clamp-2 group-hover:text-zinc-900 transition leading-snug min-h-[2.4rem]">
            {product.name}
          </h3>
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-amber-700">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-[11px] text-zinc-400">{product.totalSales}+ vendidos</span>
          </div>
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
          <div className="mt-2.5 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md">
            <Truck className="h-3 w-3" />
            <span className="text-[11px] font-semibold">Envío gratis</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  // Cargar productos reales desde la base de datos
  const [featuredResult, recentResult] = await Promise.all([
    getProducts({ destacados: true, limite: 8 }),
    getProducts({ orden: "recientes", limite: 4 }),
  ]);

  const featuredProducts = featuredResult.products;
  const recentProducts = recentResult.products;

  return (
    <div className="bg-[#FAFAF9]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0A0A0B]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-amber-500/[0.07] rounded-full blur-[150px]" />
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />

        <div className="container mx-auto px-4 py-14 md:py-20 lg:py-24 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                La nueva forma de comprar en Honduras
              </div>
              <h1 className="text-[2.75rem] md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-white">
                Comprá lo que<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">querás, como</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">querás.</span>
              </h1>
              <p className="mt-6 text-base md:text-lg text-zinc-400 max-w-md leading-relaxed">
                Miles de productos de vendedores verificados en Honduras. Pagá como quieras, recibí en tu puerta.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/productos">
                  <Button className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-900 font-bold px-8 h-13 text-base rounded-xl shadow-xl shadow-amber-500/20 transition-all hover:shadow-amber-500/40 hover:scale-[1.02] w-full sm:w-auto" size="lg">
                    Explorar productos <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/vender">
                  <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-white/5 hover:border-zinc-500 h-13 text-base rounded-xl w-full sm:w-auto" size="lg">
                    <Store className="mr-2 h-4 w-4" /> Abrí tu tienda
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 hidden lg:grid grid-cols-2 gap-3">
              {[
                { icon: Package, value: "10K+", label: "Productos", color: "from-amber-500/20 to-amber-500/5", iconColor: "text-amber-400" },
                { icon: BadgeCheck, value: "500+", label: "Vendedores", color: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-400" },
                { icon: MapPin, value: "18", label: "Departamentos", color: "from-blue-500/20 to-blue-500/5", iconColor: "text-blue-400" },
                { icon: Shield, value: "100%", label: "Compra segura", color: "from-purple-500/20 to-purple-500/5", iconColor: "text-purple-400" },
              ].map((stat, i) => (
                <div key={i} className={`bg-gradient-to-br ${stat.color} border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm`}>
                  <stat.icon className={`h-7 w-7 ${stat.iconColor} mb-3`} />
                  <p className="text-2xl font-extrabold text-white tracking-tight">{stat.value}</p>
                  <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      </section>

      {/* BENEFICIOS */}
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
                <div className={`${item.bg} p-2.5 rounded-xl shrink-0`}><item.icon className={`h-5 w-5 ${item.color}`} /></div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                  <p className="text-[11px] text-zinc-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="container mx-auto px-4 pt-12 pb-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-zinc-900">Explorá por categoría</h2>
          <Link href="/productos" className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition">
            Ver todas <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible">
          {INITIAL_CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/productos?categoria=${cat.slug}`} className="flex-shrink-0 w-[120px] md:w-auto group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-zinc-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 transition-all duration-300">
              <span className="text-3xl md:text-4xl group-hover:scale-125 transition-transform duration-300">{cat.emoji}</span>
              <span className="text-xs font-semibold text-zinc-600 group-hover:text-zinc-900 text-center transition">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS — DESDE LA DB */}
      {featuredProducts.length > 0 && (
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
            {featuredProducts.map((product) => (
              <HomeProductCard key={product.id} product={{
                ...product,
                comparePrice: product.comparePrice ?? null,
                store: product.store ? { name: product.store.name } : null,
              }} />
            ))}
          </div>
        </section>
      )}

      {/* BANNERS */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/productos?oferta=true" className="group block">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-red-500 to-orange-500 p-7 md:p-8 text-white hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold mb-4"><Flame className="h-4 w-4" />Solo por hoy</div>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">Hasta 40% OFF</h3>
                <p className="mt-2 text-white/75 text-sm">En electrónica, hogar y más.</p>
                <div className="mt-5 inline-flex items-center gap-2 bg-white text-red-600 font-bold text-sm px-4 py-2 rounded-full">Ver ofertas <ArrowRight className="h-3.5 w-3.5" /></div>
              </div>
            </div>
          </Link>
          <Link href="/registro" className="group block">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-7 md:p-8 text-white hover:shadow-xl hover:shadow-zinc-900/30 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-full text-sm font-semibold mb-4"><Gift className="h-4 w-4" />Primera compra</div>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">Envío gratis + L100</h3>
                <p className="mt-2 text-zinc-400 text-sm">Registrate y recibí tu descuento.</p>
                <div className="mt-5 inline-flex items-center gap-2 bg-amber-500 text-zinc-900 font-bold text-sm px-4 py-2 rounded-full">Crear cuenta <ArrowRight className="h-3.5 w-3.5" /></div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* RECIÉN LLEGADOS — DESDE LA DB */}
      {recentProducts.length > 0 && (
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
            {recentProducts.map((product) => (
              <HomeProductCard key={product.id} product={{
                ...product,
                comparePrice: product.comparePrice ?? null,
                store: product.store ? { name: product.store.name } : null,
              }} />
            ))}
          </div>
        </section>
      )}

      {/* CTA VENDEDORES */}
      <section className="relative overflow-hidden bg-[#0A0A0B] mt-12">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/[0.05] rounded-full blur-[120px]" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-8"><Zap className="h-4 w-4" />Oportunidad para emprendedores</div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Vendé a miles de<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">compradores en Honduras</span>
            </h2>
            <p className="mt-5 text-zinc-400 max-w-lg mx-auto leading-relaxed">Abrí tu tienda en minutos. Nosotros nos encargamos de los pagos, el soporte, y de llevar clientes a tu puerta.</p>
            <div className="mt-10">
              <Link href="/vender">
                <Button className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-900 font-bold px-10 h-13 text-base rounded-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all" size="lg">
                  Crear mi tienda gratis <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
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

      {/* MÉTODOS DE PAGO */}
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
  );
}