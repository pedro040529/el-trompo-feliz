"use client";
import { useState } from "react";
import { enviar } from "@/lib/cliente";
import { btn } from "@/lib/ui";

export default function BotonPagar({ pedidoId }: { pedidoId: string }) {
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function pagar() {
    setCargando(true);
    setError("");
    const r = await enviar<{ url: string }>("/api/checkout/pagar", "POST", { pedidoId });
    if (!r.ok) {
      setCargando(false);
      setError(r.error);
      return;
    }
    window.location.href = r.data.url;
  }

  return (
    <div>
      <button onClick={pagar} className={btn} disabled={cargando}>
        {cargando ? "Redirigiendo…" : "Pagar ahora"}
      </button>
      {error && <p className="mt-2 text-sm font-semibold text-red-600" role="alert">{error}</p>}
    </div>
  );
}
