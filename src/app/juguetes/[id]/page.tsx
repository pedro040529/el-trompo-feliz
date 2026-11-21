import Link from "next/link";
import { notFound } from "next/navigation";
import AgregarAlCarrito from "@/components/AgregarAlCarrito";
import ImagenJuguete from "@/components/ImagenJuguete";
import { obtenerSesion } from "@/lib/auth";
import { formatoPrecio, STOCK_BAJO, textoEdad } from "@/lib/constantes";
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
  const agotado = juguete.stock <= 0;

  return (
    <div className="space-y-5">
      <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-gray-500" aria-label="Ruta">
        <Link href="/" className="text-sky-700 hover:underline">Inicio</Link>
        <span>›</span>
        <Link href={juguete.categoria ? `/?categoria=${juguete.categoria.id}#catalogo` : "/"} className="text-sky-700 hover:underline">
          {juguete.categoria?.nombre ?? "Juguetes"}
        </Link>
        <span>›</span>
        <span className="text-gray-700">{juguete.nombre}</span>
      </nav>

      <div className="grid gap-8 rounded-[2rem] border border-crema-100 bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
        <div className="rounded-3xl bg-crema-50 p-3">
          <ImagenJuguete url={juguete.imagenUrl} nombre={juguete.nombre} grande />
        </div>
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-sky-700">
              {juguete.categoria?.nombre ?? "Sin categoría"}
            </span>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-extrabold text-crema-900">🎂 {textoEdad(juguete.edadMinima, juguete.edadMaxima)}</span>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight text-tinta sm:text-4xl">{juguete.nombre}</h1>
          <p className="font-display text-4xl font-extrabold text-marca-600">{formatoPrecio(juguete.precio)}</p>

          <p className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-extrabold ${agotado ? "bg-gray-100 text-gray-600" : juguete.stock <= STOCK_BAJO ? "bg-yellow-100 text-crema-900" : "bg-green-100 text-green-800"}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${agotado ? "bg-gray-400" : juguete.stock <= STOCK_BAJO ? "bg-yellow-500" : "bg-green-500"}`} aria-hidden="true" />
            {agotado ? "Agotado" : juguete.stock <= STOCK_BAJO ? `¡Últimas ${juguete.stock} unidades!` : `${juguete.stock} disponibles`}
          </p>

          <p className="whitespace-pre-line leading-relaxed text-gray-700">{juguete.descripcion}</p>

          <div className="rounded-3xl bg-crema-50 p-4">
            <AgregarAlCarrito jugueteId={juguete.id} stock={juguete.stock} logueado={!!sesion} esAdmin={sesion?.rol === "ADMIN"} />
          </div>

          <ul className="grid gap-2 text-sm font-bold text-gray-700 sm:grid-cols-3">
            <li className="rounded-2xl bg-pink-100 px-3 py-2 text-center">🔒 Pago seguro</li>
            <li className="rounded-2xl bg-sky-100 px-3 py-2 text-center">🚚 Envío a domicilio</li>
            <li className="rounded-2xl bg-green-100 px-3 py-2 text-center">📦 Stock verificado</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
