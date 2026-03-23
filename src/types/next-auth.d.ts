// ============================================
// TIPOS EXTENDIDOS DE NEXTAUTH
// ============================================
// Por defecto, NextAuth solo incluye name, email, image
// en la sesión del usuario. Nosotros necesitamos también
// el "id" y el "role" (BUYER, SELLER, ADMIN).
//
// Este archivo le dice a TypeScript:
// "Oye, la sesión de NextAuth TAMBIÉN tiene id y role"
//
// Sin este archivo, TypeScript se queja cuando hacemos:
//   session.user.id    ← Error: 'id' no existe
//   session.user.role  ← Error: 'role' no existe
// ============================================

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}
