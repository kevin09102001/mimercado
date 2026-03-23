// ============================================
// FOOTER - PIE DE PÁGINA DEL MARKETPLACE
// ============================================
// Se muestra al final de todas las páginas.
// 4 columnas: Sobre nosotros | Comprar | Vender | Ayuda
// + barra inferior con copyright y país/moneda.
//
// Es un Server Component (sin "use client")
// porque no tiene interactividad ni hooks de React.
// ============================================

import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 mt-16">
      <div className="container mx-auto px-4 py-12">

        {/* Grid responsive: 1 col mobile | 2 tablet | 4 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Columna 1: Sobre el marketplace */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{APP_NAME}</h3>
            <p className="text-sm leading-relaxed">
              El marketplace #1 de Centroamérica. Comprá y vendé productos de
              forma segura con envíos a todo Honduras.
            </p>
          </div>

          {/* Columna 2: Links para compradores */}
          <div>
            <h4 className="text-white font-semibold mb-4">Comprar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/productos" className="hover:text-white transition">
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link href="/productos?oferta=true" className="hover:text-white transition">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/productos?categoria=electronica" className="hover:text-white transition">
                  Electrónica
                </Link>
              </li>
              <li>
                <Link href="/productos?categoria=ropa-y-moda" className="hover:text-white transition">
                  Ropa y Moda
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Links para vendedores */}
          <div>
            <h4 className="text-white font-semibold mb-4">Vender</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/vender" className="hover:text-white transition">
                  Empezá a vender
                </Link>
              </li>
              <li>
                <Link href="/vender" className="hover:text-white transition">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="/vender" className="hover:text-white transition">
                  Comisiones
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Ayuda y legales */}
          <div>
            <h4 className="text-white font-semibold mb-4">Ayuda</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ayuda" className="hover:text-white transition">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-white transition">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-white transition">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior: copyright + país */}
        <div className="border-t border-zinc-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} {APP_NAME}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span>🇭🇳 Honduras</span>
            <span>Lempiras (HNL)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
