// ============================================
// LAYOUT PRINCIPAL — CON AUTENTICACIÓN
// ============================================
// Envuelve TODAS las páginas con:
//   - Providers (SessionProvider de NextAuth)
//   - Header (con estado de auth)
//   - Footer
//
// El SessionProvider permite que useSession()
// funcione en cualquier componente de la app.
// ============================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers";
import { APP_NAME } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} - El marketplace #1 de Centroamérica`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Comprá y vendé productos de forma segura en Honduras y toda Centroamérica. Miles de productos, envíos seguros, pagos protegidos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* Providers envuelve todo para que useSession funcione */}
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
