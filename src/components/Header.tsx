import Link from "next/link";
import { obtenerSesion } from "@/lib/auth";
import { ServicioCarrito } from "@/services/ServicioCarrito";
import { ServicioCatalogo } from "@/services/ServicioCatalogo";
import type { CategoriaDTO } from "@/lib/tipos";
import BotonSalir from "./BotonSalir";
import { LogoTrompo } from "./ilustraciones";

export default async function Header() {
  const sesion = await obtenerSesion();
  let cantidad = 0;
  let categorias: CategoriaDTO[] = [];
  if (sesion?.rol === "CLIENTE") {
    try {
      cantidad = await ServicioCarrito.cantidadItems(sesion.id);
    } catch {
      cantidad = 0;
    }
  }
  try {
    categorias = await ServicioCatalogo.listarCategorias();
  } catch {
    categorias = [];
  }
  const enlace = "rounded-full px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-marca-50 hover:text-marca-600";
  return (
    <header className="sticky top-0 z-20 shadow-sm">
      <div className="bg-yellow-300 py-1.5 text-center text-xs font-bold text-tinta">
        💳 Pago seguro con tarjeta &nbsp;·&nbsp; 📦 Stock actualizado &nbsp;·&nbsp; 🔎 Busca y filtra por categoría, edad y precio
      </div>
      <div className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2" aria-label="El Trompo Feliz, inicio">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-marca-500 p-1.5 shadow-md shadow-marca-500/30"><LogoTrompo className="h-full w-full" /></span>
            <span className="font-display text-xl font-extrabold leading-none text-tinta">
              El Trompo <span className="text-marca-500">Feliz</span>
            </span>
          </Link>

          <form action="/" method="GET" role="search" className="order-last flex w-full flex-1 overflow-hidden rounded-full border-2 border-crema-200 bg-crema-50 focus-within:border-marca-400 md:order-none md:w-auto">
            <input name="q" placeholder="Busca juguetes, peluches, bloques…" aria-label="Buscar juguetes" className="min-w-0 flex-1 bg-transparent px-5 py-2.5 text-sm outline-none" />
            <button className="m-1 rounded-full bg-marca-500 px-5 text-sm font-extrabold text-white transition hover:bg-marca-600" aria-label="Buscar">🔍</button>
          </form>

          <nav className="ml-auto flex items-center gap-1 md:ml-0">
            {sesion?.rol === "CLIENTE" && (
              <>
                <Link href="/pedidos" className={enlace}>Mis pedidos</Link>
                <Link href="/carrito" className="relative ml-1 flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-extrabold text-sky-900 transition hover:bg-sky-200">
                  🛒 <span className="hidden sm:inline">Carrito</span>
                  {cantidad > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-marca-500 px-1.5 text-xs font-extrabold text-white">{cantidad}</span>
                  )}
                </Link>
              </>
            )}
            {sesion?.rol === "ADMIN" && <Link href="/admin" className={enlace}>⚙️ Administración</Link>}
            {sesion ? (
              <div className="ml-2 flex items-center gap-2 text-sm">
                <span className="hidden font-bold text-gray-700 lg:inline">Hola, {sesion.nombre.split(" ")[0]}</span>
                <BotonSalir />
              </div>
            ) : (
              <>
                <Link href="/login" className={enlace}>Iniciar sesión</Link>
                <Link href="/registro" className="rounded-full bg-marca-500 px-5 py-2 text-sm font-extrabold text-white shadow-md shadow-marca-500/30 transition hover:-translate-y-0.5 hover:bg-marca-600">Registrarme</Link>
              </>
            )}
          </nav>
        </div>
      </div>
      {categorias.length > 0 && (
        <div className="bg-sky-400">
          <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-1.5" aria-label="Categorías">
            <Link href="/#catalogo" className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-extrabold text-white hover:bg-white/20">Todos los juguetes</Link>
            {categorias.map((c) => (
              <Link key={c.id} href={`/?categoria=${c.id}#catalogo`} className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold text-white/95 hover:bg-white/20">
                {c.nombre}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
