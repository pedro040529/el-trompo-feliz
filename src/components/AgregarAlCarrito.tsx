"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { enviar } from "@/lib/cliente";
import { btn, btnSec, input } from "@/lib/ui";

export default function AgregarAlCarrito({ jugueteId, stock, logueado, esAdmin }: { jugueteId: string; stock: number; logueado: boolean; esAdmin: boolean }) {
  const router = useRouter();
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  if (stock <= 0) return <p className="rounded-xl bg-gray-100 p-3 font-semibold text-gray-600">Este juguete está agotado por ahora.</p>;
  if (esAdmin) return <p className="text-sm text-gray-500">Entraste como administrador. Gestiona este juguete desde el panel.</p>;

  async function agregar() {
    if (!logueado) {
      router.push(`/login?siguiente=/juguetes/${jugueteId}`);
      return;
    }
    setCargando(true);
    setMensaje(null);
    const r = await enviar("/api/carrito", "POST", { jugueteId, cantidad });
    setCargando(false);
    if (r.ok) {
      setMensaje({ tipo: "ok", texto: "¡Agregado al carrito!" });
      router.refresh();
    } else setMensaje({ tipo: "error", texto: r.error });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-gray-700" htmlFor="cant">Cantidad</label>
        <input id="cant" type="number" min={1} max={Math.min(stock, 99)} value={cantidad} onChange={(e) => setCantidad(Math.max(1, Number(e.target.value) || 1))} className={`${input} w-24`} />
        <button className={btn} onClick={agregar} disabled={cargando}>{cargando ? "Agregando…" : "🛒 Agregar al carrito"}</button>
      </div>
      {mensaje && (
        <p className={`text-sm font-semibold ${mensaje.tipo === "ok" ? "text-green-700" : "text-red-600"}`} role="status">
          {mensaje.texto}{" "}
          {mensaje.tipo === "ok" && <button className={`${btnSec} ml-2`} onClick={() => router.push("/carrito")}>Ver carrito</button>}
        </p>
      )}
    </div>
  );
}
