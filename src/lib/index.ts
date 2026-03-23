// ============================================
// TIPOS COMPARTIDOS
// ============================================
// Types de TypeScript que se usan en múltiples archivos.
// Prisma genera sus propios types automáticamente,
// pero estos son types personalizados para la UI
// que combinan datos de varias tablas.
// ============================================

// --- PRODUCTO CON DATOS DE TIENDA ---
// Cuando mostramos un producto en la UI, también queremos
// saber de qué tienda es. Este type combina ambos.
export type ProductWithStore = {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    comparePrice: number | null;
    images: string[];
    rating: number;
    totalReviews: number;
    totalSales: number;
    stock: number;
    isActive: boolean;
    isFeatured: boolean;
    createdAt: Date;
    store: {
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        rating: number;
    };
    category: {
        id: string;
        name: string;
        slug: string;
    };
};

// --- ITEM DEL CARRITO CON DATOS DE PRODUCTO ---
// En el carrito necesitamos mostrar la info del producto
// (nombre, imagen, precio) junto con la cantidad.
export type CartItemWithProduct = {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        images: string[];
        stock: number;
        store: {
            name: string;
        };
    };
};

// --- ORDEN CON TODOS SUS DATOS ---
// Para la página de detalle de pedido, necesitamos
// la orden + sus items + la dirección + la tienda.
export type OrderWithDetails = {
    id: string;
    orderNumber: string;
    status: string;
    paymentMethod: string;
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    trackingNumber: string | null;
    createdAt: Date;
    paidAt: Date | null;
    items: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        image: string | null;
    }[];
    address: {
        fullName: string;
        phone: string;
        department: string;
        city: string;
        colony: string;
        address: string;
    };
    store: {
        name: string;
        slug: string;
    };
};

// --- RESPUESTA GENÉRICA DE SERVER ACTIONS ---
// Todos los Server Actions devuelven este formato.
// success: true/false indica si la operación funcionó.
// message: texto para mostrar al usuario.
// data: los datos que devuelve (opcional).
export type ActionResponse<T = undefined> = {
    success: boolean;
    message: string;
    data?: T;
};