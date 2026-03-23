// ============================================
// HEADER — VERSIÓN CON AUTENTICACIÓN
// ============================================
// Actualización del header que muestra:
//   - "Ingresá" si NO está logueado
//   - Nombre del usuario + menú desplegable si SÍ está logueado
//   - Opción de cerrar sesión
//   - Link al panel de vendedor/admin si tiene ese rol
// ============================================

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  ShoppingCart,
  User,
  Store,
  LogOut,
  Package,
  Settings,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_NAME, INITIAL_CATEGORIES } from "@/lib/constants";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // useSession() nos da la sesión del usuario actual
  // status puede ser: "loading", "authenticated", "unauthenticated"
  const { data: session, status } = useSession();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/productos?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Cerrar sesión y redirigir al homepage
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Barra superior negra */}
      <div className="bg-zinc-900 text-white text-xs py-1.5">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span>Envíos a toda Honduras 🇭🇳</span>
          <div className="hidden sm:flex gap-4">
            <Link href="/vender" className="hover:text-amber-400 transition">
              Vendé en {APP_NAME}
            </Link>
            <Link href="/ayuda" className="hover:text-amber-400 transition">
              Ayuda
            </Link>
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-zinc-900 whitespace-nowrap">
            {APP_NAME}
          </Link>

          {/* Búsqueda desktop */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="flex w-full">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos, marcas y más..."
                className="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button type="submit" className="rounded-l-none bg-amber-500 hover:bg-amber-600 text-white">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-1 ml-auto">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            <Link href="/vender">
              <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-zinc-600">
                <Store className="h-4 w-4" />
                Vender
              </Button>
            </Link>

            {/* ========================================
                SECCIÓN DE AUTH — Cambia según el estado
                ======================================== */}
            {status === "loading" ? (
              // Mientras carga la sesión, muestra un skeleton
              <div className="w-20 h-9 bg-zinc-100 rounded-md animate-pulse" />
            ) : session?.user ? (
              // --- USUARIO LOGUEADO: Menú desplegable ---
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-zinc-700">
                    {/* Avatar del usuario */}
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt=""
                        className="h-6 w-6 rounded-full"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-amber-700">
                          {session.user.name?.[0]?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                    <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
                      {session.user.name?.split(" ")[0] || "Mi cuenta"}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  {/* Info del usuario */}
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-zinc-900">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />

                  {/* Links del menú */}
                  <DropdownMenuItem asChild>
                    <Link href="/mis-pedidos" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      Mis pedidos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Mi perfil
                    </Link>
                  </DropdownMenuItem>

                  {/* Link a panel de vendedor (solo si es SELLER) */}
                  {session.user.role === "SELLER" && (
                    <DropdownMenuItem asChild>
                      <Link href="/seller/dashboard" className="cursor-pointer">
                        <Store className="mr-2 h-4 w-4" />
                        Panel de vendedor
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* Link a panel de admin (solo si es ADMIN) */}
                  {session.user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Panel de admin
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  {/* Cerrar sesión */}
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // --- NO LOGUEADO: Botón de login ---
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-2 text-zinc-600">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Ingresá</span>
                </Button>
              </Link>
            )}

            {/* Carrito */}
            <Link href="/carrito">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  0
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Búsqueda mobile */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearch} className="flex w-full">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="rounded-r-none border-r-0 focus-visible:ring-0"
            />
            <Button type="submit" className="rounded-l-none bg-amber-500 hover:bg-amber-600 text-white">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Categorías */}
      <nav className="border-t bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 overflow-x-auto py-2 text-sm">
            <Link href="/productos" className="whitespace-nowrap text-zinc-600 hover:text-zinc-900 font-medium transition">
              Todos
            </Link>
            {INITIAL_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/productos?categoria=${cat.slug}`}
                className="whitespace-nowrap text-zinc-600 hover:text-zinc-900 transition"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/productos?oferta=true" className="whitespace-nowrap text-amber-600 font-medium hover:text-amber-700 transition">
              🔥 Ofertas
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
