"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { enviar } from "@/lib/cliente";
import { btnSec, input } from "@/lib/ui";

export default function StockInline({ id, stock }: { id: string; stock: number }) {
  const router = useRouter();
  const [valor, setValor] = useState(String(stock));
  const [estado, setEstado] = useState<"" | "guardando" | "ok" | "error">("");
  const [msg, setMsg] = useState("");

  async function guardar() {
    setEstado("guardando");
    const r = await enviar(`/api/admin/productos/${id}`, "PATCH", { stock: valor });
    if (r.ok) {
      setEstado("ok");
      router.refresh();
    } else {
      setEstado("error");
      setMsg(r.error);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input type="number" min={0} value={valor} onChange={(e) => { setValor(e.target.value); setEstado(""); }} className={`${input} w-20`} aria-label="Stock" />
      <button className={btnSec} onClick={guardar} disabled={estado === "guardando" || valor === String(stock)}>Guardar</button>
      {estado === "ok" && <span className="text-xs font-semibold text-green-700">✓</span>}
      {estado === "error" && <span className="text-xs font-semibold text-red-600">{msg}</span>}
    </div>
  );
}
