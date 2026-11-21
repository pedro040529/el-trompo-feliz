"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { enviar } from "@/lib/cliente";
import { btn, card, etiqueta, input } from "@/lib/ui";

export default function FormCheckout({ nombre, telefono, direccion }: { nombre: string; telefono: string; direccion: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviarForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setCargando(true);
    setError("");
    const r = await enviar<{ id: string; url: string | null }>("/api/checkout", "POST", Object.fromEntries(f));
    setCargando(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    if (r.data.url) {
      window.location.href = r.data.url; // pago en Stripe
      return;
    }
    router.push(`/confirmacion/${r.data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={enviarForm} className={`${card} space-y-4`}>
      <h2 className="text-lg font-extrabold">Datos de entrega</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={etiqueta} htmlFor="nombre">Nombre de quien recibe</label>
          <input id="nombre" name="nombre" required defaultValue={nombre} className={input} />
        </div>
        <div>
          <label className={etiqueta} htmlFor="telefono">Teléfono de contacto</label>
          <input id="telefono" name="telefono" type="tel" required defaultValue={telefono} className={input} />
        </div>
      </div>
      <div>
        <label className={etiqueta} htmlFor="direccion">Dirección</label>
        <input id="direccion" name="direccion" required defaultValue={direccion} className={input} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={etiqueta} htmlFor="distrito">Distrito</label>
          <input id="distrito" name="distrito" required className={input} />
        </div>
        <div>
          <label className={etiqueta} htmlFor="referencia">Referencia (opcional)</label>
          <input id="referencia" name="referencia" className={input} />
        </div>
      </div>
      {error && <p className="text-sm font-semibold text-rose-600" role="alert">{error}</p>}
      <button className={btn} disabled={cargando}>{cargando ? "Redirigiendo a pago…" : "Pagar con tarjeta"}</button>
    </form>
  );
}
