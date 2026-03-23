// ============================================
// CONFIGURACIÓN DE NEXTAUTH.JS v5
// ============================================
// Este archivo configura toda la autenticación del marketplace.
// Soporta 2 formas de login:
//   1. Google OAuth — el usuario hace clic en "Iniciar con Google"
//   2. Credenciales — email + contraseña tradicional
//
// NextAuth se encarga de:
//   - Crear sesiones seguras (JWT)
//   - Guardar usuarios en la DB automáticamente (PrismaAdapter)
//   - Manejar tokens de refresh para Google
//   - Proteger rutas según el rol del usuario
//
// Importar en cualquier archivo:
//   import { auth, signIn, signOut } from "@/lib/auth";
// ============================================

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // PrismaAdapter conecta NextAuth con nuestra DB
  // Automáticamente crea/actualiza usuarios en la tabla User
  // y guarda las cuentas OAuth en la tabla Account
  adapter: PrismaAdapter(prisma),

  // Usamos JWT (JSON Web Tokens) para las sesiones
  // Esto significa que la sesión se guarda en una cookie encriptada
  // en el navegador del usuario, no en la DB
  session: {
    strategy: "jwt",
  },

  // Páginas personalizadas de auth
  // En vez de usar las páginas default de NextAuth, usamos las nuestras
  pages: {
    signIn: "/login",      // Nuestra página de login personalizada
    error: "/login",        // Si hay error, redirige al login
  },

  // Proveedores de autenticación
  providers: [
    // --- GOOGLE OAUTH ---
    // El usuario hace clic en "Iniciar con Google",
    // se abre una ventana de Google, elige su cuenta,
    // y vuelve al marketplace ya logueado.
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    // --- EMAIL + CONTRASEÑA ---
    // Login tradicional: el usuario ingresa su email y password.
    // Buscamos el usuario en la DB y comparamos la contraseña
    // usando bcrypt (hash seguro).
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        // Validar que se enviaron email y password
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos");
        }

        // Buscar usuario por email en la DB
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        // Si no existe el usuario o no tiene password (se registró con Google)
        if (!user || !user.password) {
          throw new Error("Credenciales incorrectas");
        }

        // Comparar la contraseña ingresada con el hash guardado en la DB
        // bcrypt.compare se encarga de hashear el input y comparar
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Credenciales incorrectas");
        }

        // Si todo está bien, devolvemos el usuario
        // NextAuth crea la sesión automáticamente
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  // Callbacks — funciones que se ejecutan en momentos clave
  callbacks: {
    // Se ejecuta cada vez que se crea o actualiza un JWT
    // Aquí metemos el ID y rol del usuario dentro del token
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        // Buscar el rol del usuario en la DB
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id! },
          select: { role: true },
        });
        token.role = dbUser?.role ?? "BUYER";
      }

      // Si el usuario actualizó su perfil, refrescar los datos
      if (trigger === "update" && session) {
        token.name = session.name;
        token.image = session.image;
      }

      return token;
    },

    // Se ejecuta cada vez que se lee la sesión
    // Pasa los datos del JWT a la sesión que ve el frontend
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
