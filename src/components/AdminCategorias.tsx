"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { enviar } from "@/lib/cliente";
import type { CategoriaDTO } from "@/lib/tipos";
import { btn, btnSec, card, etiqueta, input } from "@/lib/ui";

export default function AdminCategorias({ categorias }: { categorias: CategoriaDTO[] }) {
  const router = useRouter();
  const [editando, setEditando] = useState<CategoriaDTO | null>(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const datos = Object.fromEntries(new FormData(form));
    setCargando(true);
    setError("");
    const r = editando ? await enviar(`/api/admin/categorias/${editando.id}`, "PUT", datos) : await enviar("/api/admin/categorias", "POST", datos);
    setCargando(false);
    if (!r.ok) return setError(r.error);
    form.reset();
    setEditando(null);
    router.refresh();
  }

  async function eliminar(c: CategoriaDTO) {
    if (!confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;
    const r = await enviar(`/api/admin/categorias/${c.id}`, "DELETE");
    if (!r.ok) return setError(r.error);
    setError("");
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form key={editando?.id ?? "nueva"} onSubmit={guardar} className={`${card} h-fit space-y-4`}>
        <h2 className="text-lg font-extrabold">{editando ? "Editar categoría" : "Nueva categoría"}</h2>
        <div>
          <label className={etiqueta} htmlFor="nombre">Nombre</label>
          <input id="nombre" name="nombre" required defaultValue={editando?.nombre} className={input} />
        </div>
        <div>
          <label className={etiqueta} htmlFor="descripcion">Descripción (opcional)</label>
          <input id="descripcion" name="descripcion" defaultValue={editando?.descripcion} className={input} />
        </div>
        {error && <p className="text-sm font-semibold text-rose-600" role="alert">{error}</p>}
        <div className="flex gap-2">
          <button className={btn} disabled={cargando}>{editando ? "Guardar cambios" : "Crear categoría"}</button>
          {editando && <button type="button" className={btnSec} onClick={() => { setEditando(null); setError(""); }}>Cancelar</button>}
        </div>
      </form>
      <div className={`${card} p-0`}>
        <ul className="divide-y divide-crema-100">
          {categorias.length === 0 && <li className="p-6 text-center text-gray-500">Aún no hay categorías.</li>}
          {categorias.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="font-bold">{c.nombre}</p>
                {c.descripcion && <p className="text-sm text-gray-500">{c.descripcion}</p>}
              </div>
              <div className="flex gap-3 text-sm font-semibold">
                <button className="text-sky-700 hover:underline" onClick={() => { setEditando(c); setError(""); }}>Editar</button>
                <button className="text-marca-600 hover:underline" onClick={() => eliminar(c)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
