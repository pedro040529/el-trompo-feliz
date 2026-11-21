import Link from "next/link";
import FiltrosCatalogo, { type ParamsCatalogo } from "@/components/FiltrosCatalogo";
import TarjetaJuguete from "@/components/TarjetaJuguete";
import { ServicioCatalogo } from "@/services/ServicioCatalogo";
import { btnSec } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function Inicio({ searchParams }: { searchParams: Promise<ParamsCatalogo & { pagina?: string }> }) {
  const sp = await searchParams;
  const num = (v?: string) => (v && !Number.isNaN(Number(v)) ? Number(v) : undefined);
  const [categorias, resultado] = await Promise.all([
    ServicioCatalogo.listarCategorias(),
    ServicioCatalogo.listar({
      q: sp.q,
      categoria: sp.categoria,
      edad: sp.edad,
      precioMin: num(sp.precioMin),
      precioMax: num(sp.precioMax),
      orden: sp.orden as "recientes" | undefined,
      pagina: num(sp.pagina),
    }),
  ]);

  const enlacePagina = (n: number) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) if (v && k !== "pagina") p.set(k, v);
    p.set("pagina", String(n));
    return `/?${p.toString()}`;
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-red-500 to-amber-400 p-8 text-white shadow">
        <h1 className="text-3xl font-extrabold sm:text-4xl">¡Bienvenido a El Trompo Feliz! 🎈</h1>
        <p className="mt-2 max-w-xl text-white/90">Encuentra el juguete perfecto por edad, categoría y precio. Siempre con el stock al día.</p>
      </section>

      <FiltrosCatalogo categorias={categorias} valores={sp} />

      <p className="text-sm text-gray-600">{resultado.total} {resultado.total === 1 ? "juguete encontrado" : "juguetes encontrados"}</p>

      {resultado.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-amber-300 bg-white p-10 text-center text-gray-600">
          No encontramos juguetes con esos filtros. Prueba con otra búsqueda.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {resultado.items.map((j) => (
            <TarjetaJuguete key={j.id} j={j} />
          ))}
        </div>
      )}

      {resultado.paginas > 1 && (
        <nav className="flex items-center justify-center gap-3">
          {resultado.pagina > 1 && <Link className={btnSec} href={enlacePagina(resultado.pagina - 1)}>← Anterior</Link>}
          <span className="text-sm text-gray-600">Página {resultado.pagina} de {resultado.paginas}</span>
          {resultado.pagina < resultado.paginas && <Link className={btnSec} href={enlacePagina(resultado.pagina + 1)}>Siguiente →</Link>}
        </nav>
      )}
    </div>
  );
}
