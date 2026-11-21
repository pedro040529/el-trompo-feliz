"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { enviar } from "@/lib/cliente";
import type { CategoriaDTO, JugueteDTO } from "@/lib/tipos";
import { btn, btnSec, card, etiqueta, input } from "@/lib/ui";

export default function AdminJugueteForm({ categorias, juguete }: { categorias: CategoriaDTO[]; juguete?: JugueteDTO }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviarForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.currentTarget));
    setCargando(true);
    setError("");
    const r = juguete ? await enviar(`/api/admin/productos/${juguete.id}`, "PUT", datos) : await enviar("/api/admin/productos", "POST", datos);
    setCargando(false);
    if (!r.ok) return setError(r.error);
    router.push("/admin/juguetes");
    router.refresh();
  }

  async function eliminar() {
    if (!juguete || !confirm(`¿Eliminar "${juguete.nombre}"? Esta acción no se puede deshacer.`)) return;
    const r = await enviar(`/api/admin/productos/${juguete.id}`, "DELETE");
    if (!r.ok) return setError(r.error);
    router.push("/admin/juguetes");
    router.refresh();
  }

  return (
    <form onSubmit={enviarForm} className={`${card} max-w-3xl space-y-4`}>
      <h1 className="text-2xl font-extrabold">{juguete ? "Editar juguete" : "Registrar juguete"}</h1>
      <div>
        <label className={etiqueta} htmlFor="nombre">Nombre</label>
        <input id="nombre" name="nombre" required defaultValue={juguete?.nombre} className={input} />
      </div>
      <div>
        <label className={etiqueta} htmlFor="descripcion">Descripción</label>
        <textarea id="descripcion" name="descripcion" required rows={4} defaultValue={juguete?.descripcion} className={input} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={etiqueta} htmlFor="precio">Precio (S/)</label>
          <input id="precio" name="precio" type="number" step="0.01" min="0.01" required defaultValue={juguete?.precio} className={input} />
        </div>
        <div>
          <label className={etiqueta} htmlFor="stock">Stock</label>
          <input id="stock" name="stock" type="number" min="0" step="1" required defaultValue={juguete?.stock ?? 0} className={input} />
        </div>
        <div>
          <label className={etiqueta} htmlFor="categoria">Categoría</label>
          <select id="categoria" name="categoria" required defaultValue={juguete?.categoria?.id ?? ""} className={input}>
            <option value="" disabled>Elige una…</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={etiqueta} htmlFor="edadMinima">Edad mínima (años)</label>
          <input id="edadMinima" name="edadMinima" type="number" min="0" max="99" required defaultValue={juguete?.edadMinima ?? 0} className={input} />
        </div>
        <div>
          <label className={etiqueta} htmlFor="edadMaxima">Edad máxima (años)</label>
          <input id="edadMaxima" name="edadMaxima" type="number" min="0" max="99" required defaultValue={juguete?.edadMaxima ?? 99} className={input} />
        </div>
      </div>
      <div>
        <label className={etiqueta} htmlFor="imagenUrl">URL de la imagen (opcional)</label>
        <input id="imagenUrl" name="imagenUrl" type="url" placeholder="https://…" defaultValue={juguete?.imagenUrl} className={input} />
      </div>
      {error && <p className="text-sm font-semibold text-rose-600" role="alert">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button className={btn} disabled={cargando}>{cargando ? "Guardando…" : "Guardar"}</button>
        <button type="button" className={btnSec} onClick={() => router.push("/admin/juguetes")}>Cancelar</button>
        {juguete && <button type="button" onClick={eliminar} className="ml-auto rounded-xl border border-marca-300 px-4 py-2 text-sm font-bold text-marca-600 hover:bg-marca-50">Eliminar</button>}
      </div>
    </form>
  );
}
