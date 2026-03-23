// ============================================
// SERVER ACTIONS DE PRODUCTOS
// ============================================
// Funciones del servidor para consultar productos.
// Se ejecutan SOLO en el servidor — nunca en el navegador.
//
// Uso desde cualquier página:
//   import { getProducts, getProductBySlug } from "@/actions/products";
//   const { products, total } = await getProducts({ categoria: "electronica" });
// ============================================

"use server";

import { prisma } from "@/lib/prisma";

// ============================================
// TIPOS para los filtros de búsqueda
// ============================================
interface GetProductsParams {
  categoria?: string;     // Filtrar por slug de categoría
  q?: string;             // Búsqueda por nombre (ILIKE)
  precioMin?: number;     // Precio mínimo
  precioMax?: number;     // Precio máximo
  orden?: string;         // Ordenar: "precio-asc", "precio-desc", "recientes", "popular"
  pagina?: number;        // Número de página (empieza en 1)
  limite?: number;        // Productos por página (default 12)
  destacados?: boolean;   // Solo productos isFeatured
  oferta?: boolean;       // Solo productos con comparePrice (tienen descuento)
  tiendaId?: string;      // Filtrar por tienda específica
}

// ============================================
// OBTENER PRODUCTOS CON FILTROS Y PAGINACIÓN
// ============================================
// Esta es la función principal del catálogo.
// Recibe filtros opcionales y devuelve los productos
// que coincidan, junto con el total para paginación.
export async function getProducts(params: GetProductsParams = {}) {
  try {
    const {
      categoria,
      q,
      precioMin,
      precioMax,
      orden = "recientes",
      pagina = 1,
      limite = 12,
      destacados,
      oferta,
      tiendaId,
    } = params;

    // Construir el filtro WHERE dinámicamente
    // Solo agregamos condiciones si el filtro está presente
    const where: Record<string, unknown> = {
      isActive: true, // Solo productos activos (no eliminados)
    };

    // Filtrar por categoría
    if (categoria) {
      where.category = { slug: categoria };
    }

    // Búsqueda por nombre (case-insensitive)
    if (q) {
      where.name = { contains: q, mode: "insensitive" };
    }

    // Filtrar por rango de precio
    if (precioMin || precioMax) {
      where.price = {};
      if (precioMin) (where.price as Record<string, number>).gte = precioMin;
      if (precioMax) (where.price as Record<string, number>).lte = precioMax;
    }

    // Solo productos destacados
    if (destacados) {
      where.isFeatured = true;
    }

    // Solo productos con descuento (que tienen comparePrice)
    if (oferta) {
      where.comparePrice = { not: null };
    }

    // Filtrar por tienda
    if (tiendaId) {
      where.storeId = tiendaId;
    }

    // Definir el ordenamiento
    let orderBy: Record<string, string> = {};
    switch (orden) {
      case "precio-asc":
        orderBy = { price: "asc" };    // Más barato primero
        break;
      case "precio-desc":
        orderBy = { price: "desc" };   // Más caro primero
        break;
      case "popular":
        orderBy = { totalSales: "desc" }; // Más vendidos primero
        break;
      case "rating":
        orderBy = { rating: "desc" };  // Mejor calificados primero
        break;
      case "recientes":
      default:
        orderBy = { createdAt: "desc" }; // Más nuevos primero
    }

    // Calcular el offset para paginación
    // Página 1 → skip 0, Página 2 → skip 12, Página 3 → skip 24...
    const skip = (pagina - 1) * limite;

    // Ejecutar las dos consultas en paralelo:
    // 1. Los productos de esta página
    // 2. El total de productos que coinciden (para saber cuántas páginas hay)
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limite,
        include: {
          // Incluir datos de la tienda (nombre, slug, logo)
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              rating: true,
            },
          },
          // Incluir datos de la categoría (nombre, slug)
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Calcular total de páginas
    const totalPages = Math.ceil(total / limite);

    return {
      success: true,
      products,
      total,
      totalPages,
      currentPage: pagina,
    };
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return {
      success: false,
      products: [],
      total: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
}

// ============================================
// OBTENER UN PRODUCTO POR SLUG
// ============================================
// Para la página de detalle del producto.
// Busca por slug (URL amigable) en vez de por ID.
// Incluye datos de la tienda, categoría, y reviews.
export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            rating: true,
            totalSales: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10, // Solo las últimas 10 reviews
        },
      },
    });

    if (!product) {
      return { success: false, product: null };
    }

    return { success: true, product };
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return { success: false, product: null };
  }
}

// ============================================
// OBTENER TODAS LAS CATEGORÍAS
// ============================================
// Para mostrar en el sidebar de filtros y en la navegación.
// Solo devuelve categorías activas, ordenadas por el campo "order".
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        _count: {
          select: { products: true }, // Cuántos productos tiene cada categoría
        },
      },
    });

    return { success: true, categories };
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return { success: true, categories: [] };
  }
}
