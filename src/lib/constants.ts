// ============================================
// CONSTANTES Y CONFIGURACIÓN CENTRAL
// ============================================
// Todo lo configurable del marketplace está aquí.
// Si querés cambiar el nombre, la moneda, el impuesto,
// o cualquier configuración, solo tocás este archivo
// y se actualiza en todo el sitio automáticamente.
// ============================================

// --- IDENTIDAD DEL MARKETPLACE ---
// Este nombre aparece en el header, footer, emails, SEO, etc.
// Cuando elijas el nombre final, solo cambialo aquí.
export const APP_NAME = "MiMercado";

// --- MONEDA ---
// Honduras usa Lempiras (HNL). El símbolo "L" se muestra antes del precio.
// Ejemplo: L 1,500.00
export const DEFAULT_CURRENCY = "HNL";
export const CURRENCY_SYMBOL = "L";

// --- IMPUESTOS ---
// ISV (Impuesto Sobre Ventas) de Honduras = 15%
// Se aplica sobre el subtotal en el checkout
export const TAX_RATE = 0.15;

// --- COMISIÓN DEL MARKETPLACE ---
// Porcentaje que MiMercado se queda de cada venta (8%)
// Ejemplo: producto de L 1,000 → marketplace gana L 80, vendedor recibe L 920
export const DEFAULT_COMMISSION = 0.08;

// --- DEPARTAMENTOS DE HONDURAS ---
// Se usan en el formulario de dirección de envío.
// Honduras tiene 18 departamentos.
export const DEPARTMENTS = [
    "Atlántida",
    "Choluteca",
    "Colón",
    "Comayagua",
    "Copán",
    "Cortés",
    "El Paraíso",
    "Francisco Morazán",
    "Gracias a Dios",
    "Intibucá",
    "Islas de la Bahía",
    "La Paz",
    "Lempira",
    "Ocotepeque",
    "Olancho",
    "Santa Bárbara",
    "Valle",
    "Yoro",
] as const;

// --- MÉTODOS DE PAGO ---
// Los 4 métodos que soporta el marketplace.
// En Centroamérica no todo el mundo tiene tarjeta,
// por eso ofrecemos transferencia, Tigo Money y efectivo.
export const PAYMENT_METHODS = [
    {
        id: "CARD" as const,
        name: "Tarjeta de crédito/débito",
        icon: "💳",
        description: "Visa, Mastercard — pago instantáneo via Stripe",
    },
    {
        id: "BANK_TRANSFER" as const,
        name: "Transferencia bancaria",
        icon: "🏦",
        description: "BAC, Ficohsa, Banpaís — subí tu comprobante",
    },
    {
        id: "TIGO_MONEY" as const,
        name: "Tigo Money",
        icon: "📱",
        description: "Pagá desde tu celular Tigo — subí tu comprobante",
    },
    {
        id: "CASH_ON_DELIVERY" as const,
        name: "Pago contra entrega",
        icon: "💵",
        description: "Pagá en efectivo cuando recibas tu pedido",
    },
];

// --- ESTADOS DE ORDEN EN ESPAÑOL ---
// Mapeo de los estados internos (en inglés) a lo que ve el usuario
export const ORDER_STATUS_LABELS: Record<string, string> = {
    PENDING: "Pendiente",
    PENDING_PAYMENT: "Esperando pago",
    CONFIRMED: "Confirmado",
    PROCESSING: "En preparación",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
    REFUNDED: "Reembolsado",
};

// --- COLORES POR ESTADO DE ORDEN ---
// Para mostrar badges de colores en la UI
export const ORDER_STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PENDING_PAYMENT: "bg-orange-100 text-orange-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-indigo-100 text-indigo-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    REFUNDED: "bg-gray-100 text-gray-800",
};

// --- CATEGORÍAS INICIALES ---
// Las categorías con emojis para mostrar en la homepage y navegación
export const INITIAL_CATEGORIES = [
    { name: "Electrónica", slug: "electronica", emoji: "📱" },
    { name: "Ropa y Moda", slug: "ropa-y-moda", emoji: "👕" },
    { name: "Hogar y Cocina", slug: "hogar-y-cocina", emoji: "🏠" },
    { name: "Deportes", slug: "deportes", emoji: "⚽" },
    { name: "Belleza y Salud", slug: "belleza-y-salud", emoji: "💄" },
    { name: "Juguetes", slug: "juguetes", emoji: "🧸" },
    { name: "Alimentos", slug: "alimentos", emoji: "🥑" },
    { name: "Vehículos y Accesorios", slug: "vehiculos-y-accesorios", emoji: "🚗" },
    { name: "Libros y Educación", slug: "libros-y-educacion", emoji: "📚" },
    { name: "Artesanías", slug: "artesanias", emoji: "🎨" },
] as const;