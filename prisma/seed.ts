// ============================================
// SEED — Llenar la base de datos con datos iniciales
// ============================================
// Este script crea:
//   1. 10 categorías del marketplace
//   2. 1 usuario vendedor demo
//   3. 1 tienda demo aprobada
//   4. 12 productos demo con precios en Lempiras
//   5. 1 usuario admin
//   6. Configuraciones iniciales
//
// Ejecutar con: npx tsx prisma/seed.ts
// ============================================

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

// Crear cliente Prisma con adapter (igual que en la app)
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Sembrando datos iniciales...\n");

  // ========================================
  // 1. CATEGORÍAS
  // ========================================
  const categories = [
    { name: "Electrónica", slug: "electronica", order: 1 },
    { name: "Ropa y Moda", slug: "ropa-y-moda", order: 2 },
    { name: "Hogar y Cocina", slug: "hogar-y-cocina", order: 3 },
    { name: "Deportes", slug: "deportes", order: 4 },
    { name: "Belleza y Salud", slug: "belleza-y-salud", order: 5 },
    { name: "Juguetes", slug: "juguetes", order: 6 },
    { name: "Alimentos", slug: "alimentos", order: 7 },
    { name: "Vehículos y Accesorios", slug: "vehiculos-y-accesorios", order: 8 },
    { name: "Libros y Educación", slug: "libros-y-educacion", order: 9 },
    { name: "Artesanías", slug: "artesanias", order: 10 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ 10 categorías creadas");

  // ========================================
  // 2. USUARIO ADMIN
  // ========================================
  const admin = await prisma.user.upsert({
    where: { email: "admin@mimercado.com" },
    update: {},
    create: {
      email: "admin@mimercado.com",
      name: "Admin MiMercado",
      role: "ADMIN",
    },
  });
  console.log("✅ Usuario admin creado:", admin.email);

  // ========================================
  // 3. USUARIO VENDEDOR DEMO
  // ========================================
  const seller = await prisma.user.upsert({
    where: { email: "vendedor@demo.com" },
    update: {},
    create: {
      email: "vendedor@demo.com",
      name: "TecnoHN Store",
      role: "SELLER",
    },
  });
  console.log("✅ Usuario vendedor creado:", seller.email);

  // ========================================
  // 4. TIENDA DEMO (aprobada y lista para vender)
  // ========================================
  const store = await prisma.store.upsert({
    where: { userId: seller.id },
    update: {},
    create: {
      userId: seller.id,
      name: "TecnoHN",
      slug: "tecnohn",
      description: "La mejor tienda de tecnología en Honduras. Productos originales con garantía.",
      phone: "+504 9999-8888",
      status: "APPROVED",
      rating: 4.8,
      totalSales: 156,
    },
  });
  console.log("✅ Tienda demo creada:", store.name);

  // ========================================
  // 5. OBTENER IDs DE CATEGORÍAS
  // ========================================
  const catElectronica = await prisma.category.findUnique({ where: { slug: "electronica" } });
  const catRopa = await prisma.category.findUnique({ where: { slug: "ropa-y-moda" } });
  const catHogar = await prisma.category.findUnique({ where: { slug: "hogar-y-cocina" } });
  const catDeportes = await prisma.category.findUnique({ where: { slug: "deportes" } });

  if (!catElectronica || !catRopa || !catHogar || !catDeportes) {
    throw new Error("No se encontraron las categorías");
  }

  // ========================================
  // 6. PRODUCTOS DEMO (precios en Lempiras HNL)
  // ========================================
  const products = [
    {
      name: "iPhone 15 Pro Max 256GB Titanio Natural",
      slug: "iphone-15-pro-max-256gb",
      description: "El iPhone más potente jamás creado. Chip A17 Pro, cámara de 48MP con zoom óptico 5x, pantalla Super Retina XDR de 6.7 pulgadas, y construcción en titanio. Incluye cable USB-C. Garantía de 1 año.",
      price: 28999,
      comparePrice: 32999,
      stock: 15,
      images: [],
      categoryId: catElectronica.id,
      isFeatured: true,
      rating: 4.8,
      totalReviews: 124,
      totalSales: 89,
    },
    {
      name: "Samsung Galaxy S24 Ultra 512GB Phantom Black",
      slug: "samsung-galaxy-s24-ultra-512gb",
      description: "El Galaxy más avanzado con Galaxy AI integrada. Pantalla Dynamic AMOLED 2X de 6.8 pulgadas, cámara de 200MP, S Pen incluido, batería de 5000mAh. Procesador Snapdragon 8 Gen 3.",
      price: 26499,
      comparePrice: 29999,
      stock: 12,
      images: [],
      categoryId: catElectronica.id,
      isFeatured: true,
      rating: 4.7,
      totalReviews: 89,
      totalSales: 67,
    },
    {
      name: "AirPods Pro 2da Generación con USB-C y MagSafe",
      slug: "airpods-pro-2da-gen-usb-c",
      description: "Cancelación activa de ruido 2x más potente. Audio adaptivo, audio espacial personalizado, resistencia al agua y sudor IPX4. Estuche con USB-C, bocina y correa. Hasta 6 horas de batería.",
      price: 6999,
      comparePrice: 8499,
      stock: 30,
      images: [],
      categoryId: catElectronica.id,
      isFeatured: true,
      rating: 4.9,
      totalReviews: 256,
      totalSales: 203,
    },
    {
      name: "MacBook Air M3 15 pulgadas 16GB RAM 512GB SSD",
      slug: "macbook-air-m3-15-16gb-512gb",
      description: "La laptop más delgada del mundo con el potente chip M3. Pantalla Liquid Retina de 15.3 pulgadas, hasta 18 horas de batería, 2 puertos Thunderbolt, MagSafe. Perfecto para trabajo y creatividad.",
      price: 35999,
      comparePrice: 39999,
      stock: 8,
      images: [],
      categoryId: catElectronica.id,
      isFeatured: true,
      rating: 4.9,
      totalReviews: 43,
      totalSales: 31,
    },
    {
      name: "PlayStation 5 Slim Digital Edition + DualSense",
      slug: "ps5-slim-digital-edition",
      description: "La consola PS5 en su versión más compacta. Sin lector de discos (juegos digitales). Incluye control DualSense con retroalimentación háptica. 1TB de almacenamiento SSD. Juega en 4K a 120fps.",
      price: 13499,
      comparePrice: 14999,
      stock: 20,
      images: [],
      categoryId: catElectronica.id,
      isFeatured: true,
      rating: 4.9,
      totalReviews: 312,
      totalSales: 289,
    },
    {
      name: "Smart TV Samsung 55 pulgadas Crystal UHD 4K",
      slug: "smart-tv-samsung-55-crystal-4k",
      description: "Televisor 4K con procesador Crystal 4K, HDR10+, Smart TV con Tizen OS. Apps de streaming integradas: Netflix, Disney+, YouTube. 3 puertos HDMI, WiFi, Bluetooth. Diseño AirSlim ultradelgado.",
      price: 15999,
      comparePrice: 19999,
      stock: 10,
      images: [],
      categoryId: catElectronica.id,
      isFeatured: false,
      rating: 4.7,
      totalReviews: 98,
      totalSales: 76,
    },
    {
      name: "Nike Air Max 90 Essential Triple White",
      slug: "nike-air-max-90-essential-white",
      description: "El clásico Air Max 90 en blanco total. Upper de cuero y malla, unidad Air visible en el talón, suela de goma waffle. Estilo retro-running que nunca pasa de moda. Tallas disponibles: 7-12 US.",
      price: 3499,
      comparePrice: 4299,
      stock: 25,
      images: [],
      categoryId: catRopa.id,
      isFeatured: true,
      rating: 4.6,
      totalReviews: 67,
      totalSales: 45,
    },
    {
      name: "Adidas Ultraboost Light Running Negro",
      slug: "adidas-ultraboost-light-running",
      description: "La zapatilla de running más ligera de la familia Ultraboost. Mediasuela BOOST LIGHT, upper Primeknit+, Continental Rubber outsole. Ideal para correr y uso diario. Tallas 7-12 US.",
      price: 4299,
      comparePrice: 5199,
      stock: 18,
      images: [],
      categoryId: catDeportes.id,
      isFeatured: false,
      rating: 4.7,
      totalReviews: 45,
      totalSales: 34,
    },
    {
      name: "Instant Pot Duo 7-en-1 Olla Eléctrica 6 Cuartos",
      slug: "instant-pot-duo-7en1-6qt",
      description: "Olla de presión eléctrica multifunción: olla de presión, cocción lenta, arrocera, vaporera, saltear, calentar y yogurtera. 6 cuartos de capacidad, acero inoxidable, 13 programas preestablecidos.",
      price: 2499,
      comparePrice: 3299,
      stock: 22,
      images: [],
      categoryId: catHogar.id,
      isFeatured: false,
      rating: 4.8,
      totalReviews: 67,
      totalSales: 54,
    },
    {
      name: "Dyson V15 Detect Aspiradora Inalámbrica",
      slug: "dyson-v15-detect-aspiradora",
      description: "Aspiradora inalámbrica con láser que detecta polvo invisible. Motor Hyperdymium de 230AW, pantalla LCD que muestra partículas en tiempo real, hasta 60 minutos de autonomía. Incluye 6 accesorios.",
      price: 18999,
      comparePrice: 23999,
      stock: 5,
      images: [],
      categoryId: catHogar.id,
      isFeatured: true,
      rating: 4.6,
      totalReviews: 34,
      totalSales: 22,
    },
    {
      name: "JBL Charge 5 Parlante Bluetooth Resistente al Agua",
      slug: "jbl-charge-5-bluetooth",
      description: "Parlante portátil con sonido JBL Pro, IP67 resistente al agua y polvo, hasta 20 horas de batería, powerbank integrado para cargar tu celular. Disponible en negro, azul y rojo.",
      price: 3299,
      comparePrice: 3999,
      stock: 35,
      images: [],
      categoryId: catElectronica.id,
      isFeatured: false,
      rating: 4.7,
      totalReviews: 156,
      totalSales: 134,
    },
    {
      name: "Xiaomi Redmi Note 13 Pro 256GB Midnight Black",
      slug: "xiaomi-redmi-note-13-pro-256gb",
      description: "Smartphone con cámara de 200MP, pantalla AMOLED de 6.67 pulgadas a 120Hz, procesador Snapdragon 7s Gen 2, batería de 5100mAh con carga rápida de 67W. Dual SIM, NFC.",
      price: 7999,
      comparePrice: 9499,
      stock: 40,
      images: [],
      categoryId: catElectronica.id,
      isFeatured: false,
      rating: 4.5,
      totalReviews: 201,
      totalSales: 178,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        storeId: store.id,
      },
    });
  }
  console.log(`✅ ${products.length} productos creados`);

  // ========================================
  // 7. CONFIGURACIONES INICIALES
  // ========================================
  const settings = [
    { key: "marketplace_name", value: "MiMercado" },
    { key: "default_currency", value: "HNL" },
    { key: "tax_rate", value: "15" },
    { key: "default_commission", value: "8" },
    { key: "free_shipping_threshold", value: "2000" },
    { key: "max_cod_amount", value: "10000" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("✅ 6 configuraciones creadas");

  console.log("\n🎉 ¡Seed completado! Tu marketplace tiene datos reales.");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
