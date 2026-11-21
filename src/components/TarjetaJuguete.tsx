import Link from "next/link";
import { formatoPrecio, textoEdad } from "@/lib/constantes";
import type { JugueteDTO } from "@/lib/tipos";
import ImagenJuguete from "./ImagenJuguete";

export default function TarjetaJuguete({ j }: { j: JugueteDTO }) {
  const agotado = j.stock <= 0;
  return (
    <Link href={`/juguetes/${j.id}`} className="group flex flex-col rounded-2xl border border-amber-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <ImagenJuguete url={j.imagenUrl} nombre={j.nombre} />
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">{j.categoria?.nombre ?? "Sin categoría"}</span>
        <h3 className="line-clamp-2 font-bold text-gray-800 group-hover:text-red-600">{j.nombre}</h3>
        <span className="text-xs text-gray-500">{textoEdad(j.edadMinima, j.edadMaxima)}</span>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-extrabold text-red-600">{formatoPrecio(j.precio)}</span>
          {agotado ? (
            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-bold text-gray-600">Agotado</span>
          ) : j.stock <= 5 ? (
            <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-800">¡Quedan {j.stock}!</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
