import Link from "next/link";
import { formatoPrecio, STOCK_BAJO, textoEdad } from "@/lib/constantes";
import type { JugueteDTO } from "@/lib/tipos";
import ImagenJuguete from "./ImagenJuguete";

export default function TarjetaJuguete({ j }: { j: JugueteDTO }) {
  const agotado = j.stock <= 0;
  return (
    <Link
      href={`/juguetes/${j.id}`}
      className="group relative flex flex-col rounded-3xl border border-crema-100 bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-marca-200 hover:shadow-xl hover:shadow-marca-500/10"
    >
      <div className="relative">
        <div className={agotado ? "opacity-60 grayscale" : ""}>
          <ImagenJuguete url={j.imagenUrl} nombre={j.nombre} />
        </div>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {agotado ? (
            <span className="rounded-full bg-gray-700 px-3 py-1 text-xs font-extrabold text-white">Agotado</span>
          ) : j.stock <= STOCK_BAJO ? (
            <span className="rounded-full bg-yellow-300 px-3 py-1 text-xs font-extrabold text-tinta">¡Quedan {j.stock}!</span>
          ) : null}
        </div>
        <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-extrabold text-sky-700 shadow-sm">
          {textoEdad(j.edadMinima, j.edadMaxima)}
        </span>
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1 px-1 pb-1">
        <span className="text-xs font-extrabold uppercase tracking-wide text-sky-600">{j.categoria?.nombre ?? "Sin categoría"}</span>
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-tinta transition group-hover:text-marca-600">{j.nombre}</h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-xl font-extrabold text-marca-600">{formatoPrecio(j.precio)}</span>
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-marca-500 text-lg font-extrabold text-white transition group-hover:translate-x-0.5 group-hover:bg-marca-600"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
