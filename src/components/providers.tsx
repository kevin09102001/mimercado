// ============================================
// SESSION PROVIDER — WRAPPER DE NEXTAUTH
// ============================================
// NextAuth necesita un "SessionProvider" envolviendo toda la app
// para que useSession() funcione en los componentes client.
//
// Este es un componente client ("use client") que simplemente
// envuelve a sus children con el SessionProvider de NextAuth.
//
// Se usa en layout.tsx así:
//   <Providers>
//     <Header />
//     <main>{children}</main>
//     <Footer />
//   </Providers>
// ============================================

"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
