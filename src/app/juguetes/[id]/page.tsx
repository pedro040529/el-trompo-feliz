import Link from "next/link";
import { notFound } from "next/navigation";
import AgregarAlCarrito from "@/components/AgregarAlCarrito";
import ImagenJuguete from "@/components/ImagenJuguete";
import { obtenerSesion } from "@/lib/auth";
import { formatoPrecio, textoEdad } from "@/lib/constantes";
import { ServicioCatalogo } from "@/services/ServicioCatalogo";
import { ErrorApp } from "@/lib/errores";

export const dynamic = "force-dynamic";

export default async function DetalleJuguete({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const juguete = await ServicioCatalogo.obtener(id).catch((e) => {
    if (e instanceof ErrorApp && e.status === 404) return null;
    throw e;
  });
  if (!juguete) notFound();
  const sesion = await obtenerSesion();

  return (
    <div className="space-y-4">
      <Link href="/" className="text-sm font-semibold text-sky-700 hover:underline">← Volver al catálogo</Link>
      <div className="grid gap-8 rounded-3xl border border-amber-100 bg-white p-6 shadow-sm md:grid-cols-2">
        <ImagenJuguete url={juguete.imagenUrl} nombre={juguete.nombre} grande />
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wide text-sky-600">{juguete.categoria?.nombre ?? "Sin categoría"}</span>
          <h1 className="text-3xl font-extrabold text-gray-800">{juguete.nombre}</h1>
          <p className="text-3xl font-extrabold text-red-600">{formatoPrecio(juguete.precio)}</p>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-amber-50 p-3">
              <dt className="text-gray-500">Edad recomendada</dt>
              <dd className="font-bold">{textoEdad(juguete.edadMinima, juguete.edadMaxima)}</dd>
            </div>
            <div className="rounded-xl bg-amber-50 p-3">
              <dt className="text-gray-500">Disponibilidad</dt>
              <dd className={`font-bold ${juguete.stock > 0 ? "text-green-700" : "text-gray-600"}`}>
                {juguete.stock > 0 ? `${juguete.stock} en stock` : "Agotado"}
              </dd>
            </div>
          </dl>
          <p className="whitespace-pre-line text-gray-700">{juguete.descripcion}</p>
          <AgregarAlCarrito jugueteId={juguete.id} stock={juguete.stock} logueado={!!sesion} esAdmin={sesion?.rol === "ADMIN"} />
        </div>
      </div>
    </div>
  );
}
