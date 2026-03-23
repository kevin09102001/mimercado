// ============================================
// RUTA API DE NEXTAUTH
// ============================================
// Esta ruta maneja TODAS las peticiones de autenticación:
//   - /api/auth/signin (iniciar sesión)
//   - /api/auth/signout (cerrar sesión)
//   - /api/auth/callback/google (respuesta de Google OAuth)
//   - /api/auth/session (obtener sesión actual)
//
// Next.js 14 usa Route Handlers en vez de API Routes.
// Los handlers GET y POST se exportan desde la config de NextAuth.
// ============================================

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
