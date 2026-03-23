// ============================================
// PÁGINA DE REGISTRO — CREAR CUENTA
// ============================================
// El usuario puede registrarse de 2 formas:
//   1. Google OAuth — un clic (misma experiencia que login)
//   2. Formulario — nombre, email, contraseña
//
// Al registrarse con formulario, se crea el usuario en la DB
// con la contraseña hasheada. Después el usuario tiene que
// ir al login para iniciar sesión.
//
// Al registrarse con Google, se crea el usuario Y la sesión
// automáticamente (no necesita ir al login).
// ============================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_NAME } from "@/lib/constants";
import { registerUser } from "@/actions/auth";
import { Loader2, Mail, Lock, User, ArrowRight, Check } from "lucide-react";

export default function RegistroPage() {
  // Estados del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const router = useRouter();

  // --- REGISTRO CON GOOGLE ---
  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setError("");
    await signIn("google", { callbackUrl: "/" });
  };

  // --- REGISTRO CON FORMULARIO ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Crear FormData con los datos del formulario
    // FormData es lo que esperan los Server Actions de Next.js
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    // Llamar al Server Action que crea el usuario
    const result = await registerUser(formData);

    if (result.success) {
      // Si se creó bien, mostrar mensaje y redirigir al login
      setSuccess(result.message);
      setTimeout(() => router.push("/login"), 2000);
    } else {
      // Si hubo error, mostrarlo
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FAFAF9]">
      <div className="w-full max-w-[420px]">

        {/* Logo y título */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-zinc-900">
            {APP_NAME}
          </Link>
          <h1 className="mt-3 text-xl font-bold text-zinc-900">
            Creá tu cuenta gratis
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Empezá a comprar en {APP_NAME} hoy
          </p>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 md:p-8">

          {/* Botón de Google */}
          <Button
            onClick={handleGoogleRegister}
            disabled={googleLoading}
            variant="outline"
            className="w-full h-12 text-sm font-semibold rounded-xl border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Registrarse con Google
          </Button>

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-zinc-400 font-medium">
                o registrate con email
              </span>
            </div>
          </div>

          {/* Formulario de registro */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Campo de nombre */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-zinc-700">
                Nombre completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 h-11 rounded-xl border-zinc-200 focus:border-amber-400 focus:ring-amber-400/20"
                />
              </div>
            </div>

            {/* Campo de email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-zinc-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-11 rounded-xl border-zinc-200 focus:border-amber-400 focus:ring-amber-400/20"
                />
              </div>
            </div>

            {/* Campo de contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-zinc-700">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-10 h-11 rounded-xl border-zinc-200 focus:border-amber-400 focus:ring-amber-400/20"
                />
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            {/* Mensaje de éxito */}
            {success && (
              <div className="bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                <Check className="h-4 w-4" />
                {success}
              </div>
            )}

            {/* Botón de registro */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-900 font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all text-sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Crear mi cuenta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Texto legal */}
          <p className="mt-4 text-[11px] text-zinc-400 text-center leading-relaxed">
            Al crear tu cuenta, aceptás los{" "}
            <Link href="/terminos" className="underline hover:text-zinc-600">
              Términos y Condiciones
            </Link>{" "}
            y la{" "}
            <Link href="/privacidad" className="underline hover:text-zinc-600">
              Política de Privacidad
            </Link>{" "}
            de {APP_NAME}.
          </p>
        </div>

        {/* Link a login */}
        <p className="mt-6 text-center text-sm text-zinc-500">
          ¿Ya tenés cuenta?{" "}
          <Link
            href="/login"
            className="text-amber-600 hover:text-amber-700 font-semibold"
          >
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
