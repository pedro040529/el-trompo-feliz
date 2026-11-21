import Link from "next/link";
import FiltrosCatalogo, { type ParamsCatalogo } from "@/components/FiltrosCatalogo";
import TarjetaJuguete from "@/components/TarjetaJuguete";
import { ServicioCatalogo } from "@/services/ServicioCatalogo";
import { btn, btnSec, titulo } from "@/lib/ui";
import { RANGOS_EDAD } from "@/lib/constantes";
import { ArtePortada, FONDO, Ilustracion, tipoDe } from "@/components/ilustraciones";

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
    return `/?${p.toString()}#catalogo`;
  };

  const hayFiltros = Object.values(sp).some(Boolean);
  const nube = "M0 60V36" + "q30-34 60 0".repeat(1) + "t60 0".repeat(23) + "V60z";
  const buscarCat = (re: RegExp) => categorias.find((c) => re.test(c.nombre));
  const hrefCat = (re: RegExp) => {
    const c = buscarCat(re);
    return c ? `/?categoria=${c.id}#catalogo` : "/#catalogo";
  };

  const beneficios = [
    { icono: "📦", titulo: "Stock real", texto: "Solo ves lo que sí tenemos.", color: "bg-pink-400" },
    { icono: "🔒", titulo: "Pago seguro", texto: "Tarjeta con Stripe, sin riesgos.", color: "bg-marca-500" },
    { icono: "🚚", titulo: "Seguimiento", texto: "Mira el estado de tu pedido.", color: "bg-sky-400" },
    { icono: "🎂", titulo: "Para cada edad", texto: "Regalos justo a su medida.", color: "bg-green-500" },
  ];

  return (
    <div className="space-y-14">
      {!hayFiltros && (
        <>
          <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-marca-400 via-marca-500 to-yellow-400 px-6 pb-20 pt-10 text-white shadow-xl shadow-marca-500/20 sm:px-12 sm:pt-14">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" aria-hidden="true" />
            <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-yellow-300/30" aria-hidden="true" />
            <div className="relative grid items-center gap-6 md:grid-cols-[1fr_1.1fr]">
              <div className="space-y-5">
                <span className="inline-block rounded-full bg-white/25 px-4 py-1.5 text-sm font-extrabold backdrop-blur">🎈 Tu juguetería, ahora en línea</span>
                <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
                  Juguetes que sacan <span className="text-yellow-200">sonrisas</span>
                </h1>
                <p className="max-w-md text-lg text-white/95">Elige por edad, categoría y precio. Paga seguro y recibe en casa, siempre con el stock al día.</p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link href="#catalogo" className="inline-flex items-center gap-3 rounded-full bg-tinta py-2.5 pl-7 pr-2.5 font-extrabold text-white shadow-lg transition hover:-translate-y-0.5">
                    Ver juguetes <span className="flex h-9 w-9 items-center justify-center rounded-full bg-marca-500 text-lg">→</span>
                  </Link>
                  <Link href="#edades" className="inline-flex items-center rounded-full border-2 border-white px-7 py-3 font-extrabold transition hover:bg-white/15">
                    Comprar por edad
                  </Link>
                </div>
              </div>
              <ArtePortada className="mx-auto h-auto w-full max-w-xl" />
            </div>
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-[-1px] h-10 w-full text-[#fffaf2] sm:h-14" aria-hidden="true">
              <path fill="currentColor" d={nube} />
            </svg>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Beneficios">
            {beneficios.map((b) => (
              <div key={b.titulo} className={`flex items-center gap-4 rounded-[1.75rem] ${b.color} p-5 text-white shadow-md`}>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/25 text-3xl">{b.icono}</span>
                <div>
                  <h2 className="font-display text-xl font-extrabold leading-tight">{b.titulo}</h2>
                  <p className="text-sm text-white/90">{b.texto}</p>
                </div>
              </div>
            ))}
          </section>

          {categorias.length > 0 && (
            <section className="space-y-6">
              <div className="text-center">
                <p className="text-sm font-extrabold uppercase tracking-widest text-marca-500">Para jugar todo el día</p>
                <h2 className={titulo}>Explora por categoría</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {categorias.map((c) => {
                  const tipo = tipoDe(c.nombre);
                  return (
                    <Link
                      key={c.id}
                      href={`/?categoria=${c.id}#catalogo`}
                      className={`group flex flex-col items-center gap-3 rounded-[1.75rem] bg-gradient-to-b ${FONDO[tipo]} p-5 text-center transition hover:-translate-y-1.5 hover:shadow-xl`}
                    >
                      <Ilustracion tipo={tipo} className="h-24 w-24 transition duration-300 group-hover:scale-110" />
                      <span className="font-display text-lg font-extrabold leading-tight text-tinta">{c.nombre}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <section className="grid gap-5 md:grid-cols-2" aria-label="Destacados">
            <Link href={hrefCat(/peluch|mu[ñn]ec/i)} className="group relative flex items-center overflow-hidden rounded-[2rem] bg-gradient-to-r from-orange-200 to-orange-100 p-8 transition hover:shadow-xl">
              <div className="relative z-10 space-y-3">
                <p className="text-sm font-extrabold uppercase tracking-widest text-marca-600">Suaves y tiernos</p>
                <h2 className="font-display text-3xl font-extrabold text-tinta">Peluches y muñecas</h2>
                <span className="inline-flex items-center gap-2 rounded-full bg-tinta px-5 py-2 text-sm font-extrabold text-white">Ver colección <span aria-hidden="true">→</span></span>
              </div>
              <Ilustracion tipo="oso" className="absolute -right-2 bottom-[-18px] h-48 w-48 transition duration-300 group-hover:scale-105 sm:h-56 sm:w-56" />
            </Link>
            <Link href={hrefCat(/educa/i)} className="group relative flex items-center overflow-hidden rounded-[2rem] bg-gradient-to-r from-green-200 to-lime-100 p-8 transition hover:shadow-xl">
              <div className="relative z-10 space-y-3">
                <p className="text-sm font-extrabold uppercase tracking-widest text-green-700">Aprende jugando</p>
                <h2 className="font-display text-3xl font-extrabold text-tinta">Juegos educativos</h2>
                <span className="inline-flex items-center gap-2 rounded-full bg-tinta px-5 py-2 text-sm font-extrabold text-white">Descubrir <span aria-hidden="true">→</span></span>
              </div>
              <Ilustracion tipo="rompecabezas" className="absolute -right-2 bottom-[-18px] h-48 w-48 transition duration-300 group-hover:scale-105 sm:h-56 sm:w-56" />
            </Link>
          </section>

          <section id="edades" className="scroll-mt-40 space-y-6">
            <div className="text-center">
              <p className="text-sm font-extrabold uppercase tracking-widest text-sky-600">El regalo ideal</p>
              <h2 className={titulo}>Compra por edad</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {RANGOS_EDAD.map((r, i) => (
                <Link
                  key={r.id}
                  href={`/?edad=${r.id}#catalogo`}
                  className={`rounded-full px-7 py-3 font-display text-lg font-extrabold text-white shadow-md transition hover:-translate-y-1 ${["bg-pink-400", "bg-marca-500", "bg-sky-400", "bg-green-500", "bg-violet-500"][i % 5]}`}
                >
                  {r.etiqueta}
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      <section id="catalogo" className="scroll-mt-40">
        <div className="grid gap-8 lg:grid-cols-[290px_1fr]">
          <aside className="lg:sticky lg:top-44 lg:self-start">
            <FiltrosCatalogo categorias={categorias} valores={sp} />
          </aside>

          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-widest text-marca-500">{hayFiltros ? "Tu búsqueda" : "Catálogo"}</p>
                <h2 className={titulo}>{hayFiltros ? "Resultados" : "Nuestros juguetes"}</h2>
              </div>
              <p className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-gray-600 shadow-sm">
                {resultado.total} {resultado.total === 1 ? "juguete encontrado" : "juguetes encontrados"}
              </p>
            </div>

            {resultado.items.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-crema-300 bg-white p-12 text-center">
                <Ilustracion tipo="regalo" className="mx-auto h-28 w-28" />
                <p className="mt-3 text-lg font-extrabold text-tinta">No encontramos juguetes con esos filtros</p>
                <p className="mt-1 text-gray-600">Prueba con otra búsqueda o limpia los filtros.</p>
                <Link href="/#catalogo" className={`${btn} mt-5`}>Ver todos</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {resultado.items.map((j) => (
                  <TarjetaJuguete key={j.id} j={j} />
                ))}
              </div>
            )}

            {resultado.paginas > 1 && (
              <nav className="flex items-center justify-center gap-3 pt-2" aria-label="Paginación">
                {resultado.pagina > 1 && <Link className={btnSec} href={enlacePagina(resultado.pagina - 1)}>← Anterior</Link>}
                <span className="text-sm font-bold text-gray-600">Página {resultado.pagina} de {resultado.paginas}</span>
                {resultado.pagina < resultado.paginas && <Link className={btnSec} href={enlacePagina(resultado.pagina + 1)}>Siguiente →</Link>}
              </nav>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
