// ============================================
// FUNCIONES UTILITARIAS
// ============================================
// Funciones helper que se usan en todo el proyecto.
// Importalas así: import { formatPrice, slugify } from "@/lib/utils";
// ============================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- CLASES DE TAILWIND ---
// Combina múltiples clases de Tailwind sin conflictos.
// Ejemplo: cn("text-red-500", "text-blue-500") => "text-blue-500"
// La segunda clase gana porque twMerge resuelve conflictos.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- FORMATEAR PRECIO EN LEMPIRAS ---
// Convierte un número a formato de moneda hondureña.
// Ejemplo: formatPrice(1500) => "L 1,500.00"
// Ejemplo: formatPrice(99.5) => "L 99.50"
export function formatPrice(price: number): string {
  return `L ${price.toLocaleString("es-HN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// --- GENERAR SLUG ---
// Convierte un texto a URL amigable.
// Quita acentos, espacios, y caracteres especiales.
// Ejemplo: slugify("iPhone 15 Pro Max") => "iphone-15-pro-max"
// Ejemplo: slugify("Café Hondureño Orgánico") => "cafe-hondureno-organico"
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")                    // Separa letras de sus acentos
    .replace(/[\u0300-\u036f]/g, "")     // Elimina los acentos
    .replace(/[^a-z0-9]+/g, "-")         // Reemplaza todo lo que no sea letra/número por guión
    .replace(/(^-|-$)/g, "");            // Quita guiones al inicio y final
}

// --- GENERAR NÚMERO DE ORDEN ---
// Crea un número legible para cada pedido.
// Ejemplo: generateOrderNumber() => "ORD-2026-04821"
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, "0");
  return `ORD-${year}-${random}`;
}

// --- TRUNCAR TEXTO ---
// Corta un texto largo y agrega "..." al final.
// Ejemplo: truncate("Descripción muy larga del producto", 20) => "Descripción muy larg..."
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

// --- CALCULAR ISV (IMPUESTO) ---
// Calcula el 15% de ISV sobre un subtotal.
// Ejemplo: calculateTax(1000) => 150.00
export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * 0.15 * 100) / 100;
}

// --- CALCULAR COMISIÓN DEL MARKETPLACE ---
// Calcula cuánto se queda el marketplace de una venta.
// Por defecto cobra 8%.
// Ejemplo: calculateCommission(1000) => 80.00
// Ejemplo: calculateCommission(1000, 0.10) => 100.00  (10%)
export function calculateCommission(
  subtotal: number,
  rate: number = 0.08
): number {
  return Math.round(subtotal * rate * 100) / 100;
}

// --- TIEMPO RELATIVO ---
// Muestra cuánto tiempo pasó desde una fecha.
// Ejemplo: timeAgo(haceCincoMinutos) => "hace 5 minutos"
// Ejemplo: timeAgo(haceDosDias) => "hace 2 días"
export function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "hace un momento";
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  }
  if (seconds < 604800) {
    const days = Math.floor(seconds / 86400);
    return `hace ${days} ${days === 1 ? "día" : "días"}`;
  }
  // Si pasó más de una semana, muestra la fecha completa
  return date.toLocaleDateString("es-HN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// --- GENERAR LINK DE WHATSAPP ---
// Crea un link para compartir un producto por WhatsApp.
// Al hacer clic, abre WhatsApp con un mensaje pre-escrito.
// Ejemplo: whatsappShareUrl("iPhone 15", "https://mimercado.com/producto/iphone-15")
// => "https://wa.me/?text=Mirá este producto..."
export function whatsappShareUrl(
  productName: string,
  productUrl: string
): string {
  const text = encodeURIComponent(
    `¡Mirá este producto en MiMercado! 🛒\n${productName}\n${productUrl}`
  );
  return `https://wa.me/?text=${text}`;
}