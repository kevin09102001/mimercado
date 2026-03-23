// ============================================
// SERVER ACTIONS DE AUTENTICACIÓN
// ============================================
// Funciones del servidor para registrar usuarios
// y manejar el login. Se llaman desde los formularios
// del frontend con useFormState o directamente.
//
// "use server" le dice a Next.js que estas funciones
// SOLO se ejecutan en el servidor — nunca se envían
// al navegador del usuario. Esto es importante porque
// aquí manejamos contraseñas y acceso a la DB.
// ============================================

"use server";

import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

// ============================================
// SCHEMA DE VALIDACIÓN PARA REGISTRO
// ============================================
// Zod valida los datos ANTES de tocar la base de datos.
// Si algo no cumple las reglas, devuelve un error claro.
const registerSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
  email: z
    .string()
    .email("Ingresá un email válido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede tener más de 100 caracteres"),
});

// ============================================
// REGISTRAR NUEVO USUARIO
// ============================================
// Recibe nombre, email, password del formulario.
// Valida los datos, verifica que el email no exista,
// hashea la contraseña, y crea el usuario en la DB.
export async function registerUser(formData: FormData) {
  try {
    // 1. Extraer datos del formulario
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // 2. Validar con Zod
    const validatedData = registerSchema.safeParse(rawData);
    if (!validatedData.success) {
      // Si la validación falla, devolvemos el primer error
      return {
        success: false,
        message: validatedData.error.errors[0].message,
      };
    }

    const { name, email, password } = validatedData.data;

    // 3. Verificar que el email no esté registrado
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Este email ya está registrado. ¿Querés iniciar sesión?",
      };
    }

    // 4. Hashear la contraseña
    // bcrypt agrega un "salt" aleatorio y hashea la contraseña
    // Esto significa que incluso si alguien accede a la DB,
    // no puede ver las contraseñas reales. El número 10 es
    // la cantidad de "rondas" de encriptación (más = más seguro pero más lento)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Crear el usuario en la base de datos
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "BUYER", // Todos los usuarios nuevos son compradores
      },
    });

    // 6. Devolver éxito
    return {
      success: true,
      message: "¡Cuenta creada! Ya podés iniciar sesión.",
    };
  } catch (error) {
    // Si algo sale mal, devolvemos un error genérico
    console.error("Error al registrar usuario:", error);
    return {
      success: false,
      message: "Hubo un error al crear tu cuenta. Intentá de nuevo.",
    };
  }
}

// ============================================
// INICIAR SESIÓN CON EMAIL + CONTRASEÑA
// ============================================
// Llama a signIn de NextAuth con el provider "credentials".
// NextAuth se encarga de verificar la contraseña (ver auth.ts)
// y crear la sesión.
export async function loginWithCredentials(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return {
        success: false,
        message: "Email y contraseña son requeridos",
      };
    }

    // signIn de NextAuth intenta autenticar al usuario
    // redirect: false evita que NextAuth redirija automáticamente
    // (nosotros manejamos la redirección en el frontend)
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: "¡Bienvenido!",
    };
  } catch (error: unknown) {
    // NextAuth lanza un error específico si las credenciales son incorrectas
    console.error("Error al iniciar sesión:", error);
    return {
      success: false,
      message: "Email o contraseña incorrectos",
    };
  }
}
