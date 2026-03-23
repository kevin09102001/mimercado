// ============================================
// PÁGINA DE CONFIRMACIÓN DE ORDEN
// ============================================
// URL: /checkout/confirmacion?orden=ORD-2026-12345
//
// Se muestra después de que el usuario confirma su pedido.
// Muestra:
//   - Ícono de éxito
//   - Número de orden
//   - Instrucciones según el método de pago
//   - Links a mis pedidos y seguir comprando
// ============================================

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import {
    CheckCircle,
    Package,
    ArrowRight,
    ShoppingBag,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pedido confirmado",
};

export default async function ConfirmacionPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const params = await searchParams;
    const orderNumber = params.orden || "---";

    return (
        <div className="bg-[#FAFAF9] min-h-screen">
            <div className="container mx-auto px-4 py-16 max-w-lg text-center">

                {/* Ícono de éxito */}
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>

                {/* Título */}
                <h1 className="text-2xl font-bold text-zinc-900">
                    ¡Pedido confirmado!
                </h1>
                <p className="mt-2 text-zinc-500">
                    Gracias por tu compra en {APP_NAME}
                </p>

                {/* Número de orden */}
                <div className="mt-6 bg-white rounded-2xl border border-zinc-100 p-6">
                    <p className="text-sm text-zinc-500">Número de orden</p>
                    <p className="text-2xl font-extrabold text-zinc-900 mt-1 tracking-tight">
                        {orderNumber}
                    </p>
                    <p className="text-xs text-zinc-400 mt-2">
                        Guardá este número para rastrear tu pedido
                    </p>
                </div>

                {/* Próximos pasos */}
                <div className="mt-6 bg-amber-50 rounded-2xl p-6 text-left">
                    <h3 className="font-semibold text-zinc-900 mb-3">¿Qué sigue?</h3>
                    <ul className="space-y-2 text-sm text-zinc-700">
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold mt-0.5">1.</span>
                            El vendedor va a preparar tu pedido
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold mt-0.5">2.</span>
                            Te notificamos cuando sea enviado con número de rastreo
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold mt-0.5">3.</span>
                            Recibí tu pedido en la puerta de tu casa
                        </li>
                    </ul>
                </div>

                {/* Botones */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Link href="/mis-pedidos" className="flex-1">
                        <Button variant="outline" className="w-full rounded-xl h-12">
                            <Package className="mr-2 h-4 w-4" />
                            Ver mis pedidos
                        </Button>
                    </Link>
                    <Link href="/productos" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-900 font-bold rounded-xl h-12 shadow-lg shadow-amber-500/20">
                            Seguir comprando
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}