import Link from "next/link";
import { RANGOS_EDAD } from "@/lib/constantes";
import type { CategoriaDTO } from "@/lib/tipos";
import { btn, btnSec, input } from "@/lib/ui";

export interface ParamsCatalogo {
  q?: string;
  categoria?: string;
  edad?: string;
  precioMin?: string;
  precioMax?: string;
  orden?: string;
}

function Opcion({ nombre, valor, marcado, texto }: { nombre: string; valor: string; marcado: boolean; texto: string }) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name={nombre} value={valor} defaultChecked={marcado} className="peer sr-only" />
      <span className="block rounded-full border-2 border-transparent bg-crema-50 px-4 py-1.5 text-sm font-bold text-gray-700 transition hover:bg-marca-50 peer-checked:border-marca-500 peer-checked:bg-marca-500 peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-marca-200">
        {texto}
      </span>
    </label>
  );
}

export default function FiltrosCatalogo({ categorias, valores }: { categorias: CategoriaDTO[]; valores: ParamsCatalogo }) {
  const titulo = "mb-2 block text-xs font-extrabold uppercase tracking-wider text-gray-500";
  return (
    <form method="GET" action="/#catalogo" className="overflow-hidden rounded-3xl border border-crema-100 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-sky-400 to-sky-500 px-5 py-4">
        <h2 className="font-display text-xl font-extrabold text-white">Encuentra tu juguete</h2>
      </div>
      <div className="space-y-6 p-5">
        <div>
          <label className={titulo} htmlFor="f-q">Buscar</label>
          <input id="f-q" name="q" defaultValue={valores.q} placeholder="Nombre del juguete…" className={input} />
        </div>

        <fieldset>
          <legend className={titulo}>Categoría</legend>
          <div className="flex flex-wrap gap-2">
            <Opcion nombre="categoria" valor="" marcado={!valores.categoria} texto="Todas" />
            {categorias.map((c) => (
              <Opcion key={c.id} nombre="categoria" valor={c.id} marcado={valores.categoria === c.id} texto={c.nombre} />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={titulo}>Edad recomendada</legend>
          <div className="flex flex-wrap gap-2">
            <Opcion nombre="edad" valor="" marcado={!valores.edad} texto="Todas" />
            {RANGOS_EDAD.map((r) => (
              <Opcion key={r.id} nombre="edad" valor={r.id} marcado={valores.edad === r.id} texto={r.etiqueta} />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={titulo}>Precio (S/)</legend>
          <div className="flex items-center gap-2">
            <input name="precioMin" type="number" min={0} step="0.01" defaultValue={valores.precioMin} placeholder="Mín." className={input} aria-label="Precio mínimo" />
            <span className="text-gray-400">–</span>
            <input name="precioMax" type="number" min={0} step="0.01" defaultValue={valores.precioMax} placeholder="Máx." className={input} aria-label="Precio máximo" />
          </div>
        </fieldset>

        <div>
          <label className={titulo} htmlFor="f-orden">Ordenar por</label>
          <select id="f-orden" name="orden" defaultValue={valores.orden ?? "recientes"} className={input}>
            <option value="recientes">Más recientes</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="nombre">Nombre A-Z</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <button className={`${btn} w-full`}>Aplicar filtros</button>
          <Link href="/#catalogo" className={`${btnSec} w-full`}>Limpiar</Link>
        </div>
      </div>
    </form>
  );
}
