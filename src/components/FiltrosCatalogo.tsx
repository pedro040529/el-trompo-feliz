import Link from "next/link";
import { RANGOS_EDAD } from "@/lib/constantes";
import type { CategoriaDTO } from "@/lib/tipos";
import { btn, btnSec, card, input } from "@/lib/ui";

export interface ParamsCatalogo {
  q?: string;
  categoria?: string;
  edad?: string;
  precioMin?: string;
  precioMax?: string;
  orden?: string;
}

export default function FiltrosCatalogo({ categorias, valores }: { categorias: CategoriaDTO[]; valores: ParamsCatalogo }) {
  return (
    <form method="GET" action="/" className={`${card} grid gap-3 sm:grid-cols-2 lg:grid-cols-6`}>
      <input name="q" defaultValue={valores.q} placeholder="Buscar juguete…" className={`${input} lg:col-span-2`} aria-label="Buscar por nombre" />
      <select name="categoria" defaultValue={valores.categoria ?? ""} className={input} aria-label="Categoría">
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>
      <select name="edad" defaultValue={valores.edad ?? ""} className={input} aria-label="Edad recomendada">
        <option value="">Todas las edades</option>
        {RANGOS_EDAD.map((r) => (
          <option key={r.id} value={r.id}>{r.etiqueta}</option>
        ))}
      </select>
      <div className="flex gap-2">
        <input name="precioMin" type="number" min={0} step="0.01" defaultValue={valores.precioMin} placeholder="S/ mín." className={input} aria-label="Precio mínimo" />
        <input name="precioMax" type="number" min={0} step="0.01" defaultValue={valores.precioMax} placeholder="S/ máx." className={input} aria-label="Precio máximo" />
      </div>
      <select name="orden" defaultValue={valores.orden ?? "recientes"} className={input} aria-label="Ordenar por">
        <option value="recientes">Más recientes</option>
        <option value="precio-asc">Precio: menor a mayor</option>
        <option value="precio-desc">Precio: mayor a menor</option>
        <option value="nombre">Nombre A-Z</option>
      </select>
      <div className="flex gap-2 sm:col-span-2 lg:col-span-6">
        <button className={btn}>Buscar</button>
        <Link href="/" className={btnSec}>Limpiar filtros</Link>
      </div>
    </form>
  );
}
