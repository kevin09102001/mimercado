// ============================================
// CLIENTE DE PRISMA 7 — Conexión a la base de datos
// ============================================
// Prisma 7 usa "adapters" para conectarse a la DB.
// Necesitamos el adapter de PostgreSQL (@prisma/adapter-pg)
// que usa el paquete "pg" por debajo.
//
// Uso: import { prisma } from "@/lib/prisma";
//      const productos = await prisma.product.findMany();
// ============================================

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createClient() {
    // Crear un pool de conexiones PostgreSQL
    // usando la URL de la variable de entorno DATABASE_URL
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });

    // Crear el adapter que conecta Prisma con PostgreSQL
    const adapter = new PrismaPg(pool);

    // Crear el cliente de Prisma usando el adapter
    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}