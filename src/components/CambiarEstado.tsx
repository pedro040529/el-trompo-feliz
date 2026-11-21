"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { enviar } from "@/lib/cliente";
import { ESTADOS, ETIQUETA_ESTADO, type EstadoPedido } from "@/lib/constantes";
import { btn } from "@/lib/ui";

export default function CambiarEstado({ id, estado }: { id: string; estado: EstadoPedido }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const siguiente = ESTADOS[ESTADOS.indexOf(estado) + 1];

  if (!siguiente) return <p className="text-sm font-semibold text-green-700">Pedido entregado ✓</p>;

  async function avanzar() {
    setCargando(true);
    setError("");
    const r = await enviar(`/api/admin/pedidos/${id}`, "PATCH", { estado: siguiente });
    setCargando(false);
    if (!r.ok) return setError(r.error);
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <button className={btn} onClick={avanzar} disabled={cargando}>
        {cargando ? "Actualizando…" : `Marcar como ${ETIQUETA_ESTADO[siguiente].toLowerCase()}`}
      </button>
      {siguiente === "PAGADO" && <p className="text-xs text-gray-500">Al marcarlo como pagado se descuenta el stock y se vacía el carrito del cliente.</p>}
      {error && <p className="text-sm font-semibold text-rose-600" role="alert">{error}</p>}
    </div>
  );
}
