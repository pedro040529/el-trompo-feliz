"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { enviar } from "@/lib/cliente";
import { formatoPrecio } from "@/lib/constantes";
import type { CarritoDTO } from "@/lib/tipos";
import { btn, btnSec, card } from "@/lib/ui";
import ImagenJuguete from "./ImagenJuguete";

export default function CarritoCliente({ inicial }: { inicial: CarritoDTO }) {
  const router = useRouter();
  const [carrito, setCarrito] = useState(inicial);
  const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState<string | null>(null);

  async function actualizar(id: string, cantidad: number) {
    setOcupado(id);
    setError("");
    const r = await enviar<CarritoDTO>(`/api/carrito/${id}`, "PATCH", { cantidad });
    setOcupado(null);
    if (r.ok) {
      setCarrito(r.data);
      router.refresh();
    } else setError(r.error);
  }

  async function quitar(id: string) {
    setOcupado(id);
    setError("");
    const r = await enviar<CarritoDTO>(`/api/carrito/${id}`, "DELETE");
    setOcupado(null);
    if (r.ok) {
      setCarrito(r.data);
      router.refresh();
    } else setError(r.error);
  }

  if (carrito.items.length === 0) {
    return (
      <div className={`${card} py-12 text-center`}>
        <p className="text-5xl">🛒</p>
        <p className="mt-3 text-lg font-bold">Tu carrito está vacío</p>
        <Link href="/" className={`${btn} mt-4`}>Ver juguetes</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-3">
        {carrito.items.map((i) => (
          <div key={i.jugueteId} className={`${card} flex gap-4 ${i.disponible ? "" : "border-rose-300 bg-rose-50"}`}>
            <div className="w-24 shrink-0"><ImagenJuguete url={i.imagenUrl} nombre={i.nombre} /></div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex justify-between gap-2">
                <Link href={`/juguetes/${i.jugueteId}`} className="font-bold hover:text-marca-600">{i.nombre}</Link>
                <span className="font-extrabold text-marca-600">{formatoPrecio(i.subtotal)}</span>
              </div>
              <span className="text-sm text-gray-500">{formatoPrecio(i.precioUnitario)} c/u</span>
              {!i.disponible && (
                <p className="text-sm font-semibold text-rose-600" role="alert">
                  {i.stock === 0 ? "Este juguete se agotó. Quítalo para continuar." : `Solo quedan ${i.stock}. Ajusta la cantidad para continuar.`}
                </p>
              )}
              <div className="mt-auto flex items-center gap-2">
                <button className={btnSec} disabled={ocupado === i.jugueteId || i.cantidad <= 1} onClick={() => actualizar(i.jugueteId, i.cantidad - 1)} aria-label="Disminuir cantidad">−</button>
                <span className="w-8 text-center font-bold">{i.cantidad}</span>
                <button className={btnSec} disabled={ocupado === i.jugueteId || i.cantidad >= i.stock} onClick={() => actualizar(i.jugueteId, i.cantidad + 1)} aria-label="Aumentar cantidad">+</button>
                <button className="ml-auto text-sm font-semibold text-marca-600 hover:underline" disabled={ocupado === i.jugueteId} onClick={() => quitar(i.jugueteId)}>Quitar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <aside className={`${card} h-fit space-y-3`}>
        <h2 className="text-lg font-extrabold">Resumen</h2>
        <div className="flex justify-between text-sm"><span>Productos ({carrito.cantidadTotal})</span><span>{formatoPrecio(carrito.total)}</span></div>
        <div className="flex justify-between border-t border-crema-100 pt-3 text-lg font-extrabold"><span>Total</span><span className="text-marca-600">{formatoPrecio(carrito.total)}</span></div>
        {error && <p className="text-sm font-semibold text-rose-600" role="alert">{error}</p>}
        {carrito.hayProblemas ? (
          <p className="text-sm font-semibold text-rose-600">Resuelve los productos marcados para continuar.</p>
        ) : (
          <Link href="/checkout" className={`${btn} w-full`}>Continuar con la compra</Link>
        )}
      </aside>
    </div>
  );
}
