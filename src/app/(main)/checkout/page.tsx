// ============================================
// PÁGINA DE CHECKOUT
// ============================================
// URL: /checkout
//
// Proceso:
//   1. Usuario llena dirección de envío
//   2. Elige método de pago
//   3. Ve resumen con ISV y total
//   4. Confirma y se crea la orden
//   5. Redirige a página de confirmación
// ============================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { APP_NAME, DEPARTMENTS, PAYMENT_METHODS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/actions/orders";
import {
    MapPin,
    CreditCard,
    ShoppingBag,
    ArrowRight,
    ArrowLeft,
    Loader2,
    Check,
    Shield,
    Truck,
    ChevronRight,
} from "lucide-react";

export default function CheckoutPage() {
    const router = useRouter();

    // Estado del formulario
    const [step, setStep] = useState(1); // 1: dirección, 2: pago, 3: confirmación
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Datos del formulario
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [city, setCity] = useState("");
    const [colony, setColony] = useState("");
    const [address, setAddress] = useState("");
    const [reference, setReference] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");

    // --- ENVIAR ORDEN ---
    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("phone", phone);
        formData.append("department", department);
        formData.append("city", city);
        formData.append("colony", colony);
        formData.append("address", address);
        formData.append("reference", reference);
        formData.append("paymentMethod", paymentMethod);

        const result = await createOrder(formData);

        if (result.success) {
            // Redirigir a página de confirmación
            router.push(`/checkout/confirmacion?orden=${result.orderNumber}`);
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    // Validar paso 1 (dirección)
    const isStep1Valid = fullName && phone && department && city && colony && address;
    // Validar paso 2 (pago)
    const isStep2Valid = !!paymentMethod;

    return (
        <div className="bg-[#FAFAF9] min-h-screen">
            <div className="container mx-auto px-4 py-6 max-w-3xl">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
                    <Link href="/carrito" className="hover:text-zinc-900 transition">Carrito</Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="text-zinc-900 font-medium">Checkout</span>
                </div>

                <h1 className="text-2xl font-bold text-zinc-900 mb-8">Finalizar compra</h1>

                {/* ========================================
            INDICADOR DE PASOS
            ======================================== */}
                <div className="flex items-center gap-3 mb-8">
                    {[
                        { num: 1, label: "Dirección", icon: MapPin },
                        { num: 2, label: "Pago", icon: CreditCard },
                        { num: 3, label: "Confirmar", icon: Check },
                    ].map((s, i) => (
                        <div key={s.num} className="flex items-center gap-3 flex-1">
                            <div className={`flex items-center gap-2 ${step >= s.num ? "text-amber-600" : "text-zinc-400"}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${step > s.num ? "bg-emerald-500 text-white" :
                                    step === s.num ? "bg-amber-500 text-white" :
                                        "bg-zinc-200 text-zinc-500"
                                    }`}>
                                    {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                                </div>
                                <span className={`text-sm font-medium hidden sm:block ${step >= s.num ? "text-zinc-900" : "text-zinc-400"}`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < 2 && <div className={`flex-1 h-0.5 ${step > s.num ? "bg-emerald-500" : "bg-zinc-200"}`} />}
                        </div>
                    ))}
                </div>

                {/* ========================================
            PASO 1: DIRECCIÓN DE ENVÍO
            ======================================== */}
                {step === 1 && (
                    <div className="bg-white rounded-2xl border border-zinc-100 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <MapPin className="h-5 w-5 text-amber-500" />
                            <h2 className="text-lg font-bold text-zinc-900">Dirección de envío</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Nombre + Teléfono */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-zinc-700">Nombre de quien recibe</Label>
                                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Juan Pérez" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-zinc-700">Teléfono</Label>
                                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+504 9999-8888" className="h-11 rounded-xl" />
                                </div>
                            </div>

                            {/* Departamento + Ciudad */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-zinc-700">Departamento</Label>
                                    <select
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        className="w-full h-11 px-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400"
                                    >
                                        <option value="">Seleccioná...</option>
                                        {DEPARTMENTS.map((dep) => (
                                            <option key={dep} value={dep}>{dep}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-zinc-700">Ciudad</Label>
                                    <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="San Pedro Sula" className="h-11 rounded-xl" />
                                </div>
                            </div>

                            {/* Colonia + Dirección */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-zinc-700">Colonia / Barrio</Label>
                                <Input value={colony} onChange={(e) => setColony(e.target.value)} placeholder="Col. Las Mercedes" className="h-11 rounded-xl" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-zinc-700">Dirección exacta</Label>
                                <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Calle principal, casa #123, frente al parque..." className="rounded-xl min-h-[80px]" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-zinc-700">Referencia (opcional)</Label>
                                <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Casa color azul, portón negro..." className="h-11 rounded-xl" />
                            </div>
                        </div>

                        <Button
                            onClick={() => setStep(2)}
                            disabled={!isStep1Valid}
                            className="w-full mt-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-900 font-bold rounded-xl h-12 text-base shadow-lg shadow-amber-500/20"
                        >
                            Continuar al pago <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* ========================================
            PASO 2: MÉTODO DE PAGO
            ======================================== */}
                {step === 2 && (
                    <div className="bg-white rounded-2xl border border-zinc-100 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <CreditCard className="h-5 w-5 text-amber-500" />
                            <h2 className="text-lg font-bold text-zinc-900">Método de pago</h2>
                        </div>

                        <div className="space-y-3">
                            {PAYMENT_METHODS.map((method) => (
                                <label
                                    key={method.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === method.id
                                        ? "border-amber-400 bg-amber-50"
                                        : "border-zinc-100 hover:border-zinc-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method.id}
                                        checked={paymentMethod === method.id}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${paymentMethod === method.id ? "border-amber-500" : "border-zinc-300"
                                        }`}>
                                        {paymentMethod === method.id && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                        )}
                                    </div>
                                    <span className="text-2xl">{method.icon}</span>
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-900">{method.name}</p>
                                        <p className="text-xs text-zinc-500">{method.description}</p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* Info según método elegido */}
                        {paymentMethod === "BANK_TRANSFER" && (
                            <div className="mt-4 bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
                                <p className="font-semibold mb-1">Datos para transferencia:</p>
                                <p>Banco: BAC Honduras</p>
                                <p>Cuenta: 123-456-789-0</p>
                                <p>A nombre de: {APP_NAME} S.A.</p>
                                <p className="mt-2 text-xs text-blue-600">Después de transferir, subí tu comprobante en la página del pedido.</p>
                            </div>
                        )}

                        {paymentMethod === "TIGO_MONEY" && (
                            <div className="mt-4 bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
                                <p className="font-semibold mb-1">Enviá el pago a:</p>
                                <p>Número Tigo: 9999-8888</p>
                                <p className="mt-2 text-xs text-blue-600">Después de pagar, subí tu comprobante en la página del pedido.</p>
                            </div>
                        )}

                        <div className="flex gap-3 mt-6">
                            <Button onClick={() => setStep(1)} variant="outline" className="rounded-xl h-12">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                            </Button>
                            <Button
                                onClick={() => setStep(3)}
                                disabled={!isStep2Valid}
                                className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-900 font-bold rounded-xl h-12 text-base shadow-lg shadow-amber-500/20"
                            >
                                Revisar pedido <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* ========================================
            PASO 3: CONFIRMAR PEDIDO
            ======================================== */}
                {step === 3 && (
                    <div className="space-y-4">
                        {/* Resumen de dirección */}
                        <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-amber-500" />
                                    <h3 className="font-semibold text-zinc-900">Enviar a</h3>
                                </div>
                                <button onClick={() => setStep(1)} className="text-xs text-amber-600 font-medium hover:text-amber-700">Editar</button>
                            </div>
                            <p className="text-sm text-zinc-700">{fullName}</p>
                            <p className="text-sm text-zinc-500">{address}, {colony}</p>
                            <p className="text-sm text-zinc-500">{city}, {department}</p>
                            <p className="text-sm text-zinc-500">{phone}</p>
                        </div>

                        {/* Resumen de pago */}
                        <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-amber-500" />
                                    <h3 className="font-semibold text-zinc-900">Método de pago</h3>
                                </div>
                                <button onClick={() => setStep(2)} className="text-xs text-amber-600 font-medium hover:text-amber-700">Cambiar</button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xl">{PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.icon}</span>
                                <span className="text-sm text-zinc-700">{PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.name}</span>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl border border-red-100">
                                {error}
                            </div>
                        )}

                        {/* Botones */}
                        <div className="flex gap-3">
                            <Button onClick={() => setStep(2)} variant="outline" className="rounded-xl h-12">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-900 font-bold rounded-xl h-12 text-base shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Confirmar pedido <ShoppingBag className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Seguridad */}
                        <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 mt-2">
                            <Shield className="h-3.5 w-3.5" />
                            <span>Tu información está protegida y encriptada</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}