import Link from "next/link";
import { obtenerSesion } from "@/lib/auth";
import { ServicioCarrito } from "@/services/ServicioCarrito";
import BotonSalir from "./BotonSalir";

export default async function Header() {
  const sesion = await obtenerSesion();
  let cantidad = 0;
  if (sesion?.rol === "CLIENTE") {
    try {
      cantidad = await ServicioCarrito.cantidadItems(sesion.id);
    } catch {
      cantidad = 0;
    }
  }
  const enlace = "rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-800 hover:bg-amber-300/60";
  return (
    <header className="sticky top-0 z-10 border-b border-amber-300 bg-amber-200">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
        <Link href="/" className="mr-4 text-xl font-extrabold text-red-600">
          🪀 El Trompo Feliz
        </Link>
        <nav className="flex flex-1 flex-wrap items-center gap-1">
          <Link href="/" className={enlace}>Juguetes</Link>
          {sesion?.rol === "CLIENTE" && (
            <>
              <Link href="/pedidos" className={enlace}>Mis pedidos</Link>
              <Link href="/carrito" className={enlace}>
                🛒 Carrito{cantidad > 0 && <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">{cantidad}</span>}
              </Link>
            </>
          )}
          {sesion?.rol === "ADMIN" && <Link href="/admin" className={enlace}>Administración</Link>}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          {sesion ? (
            <>
              <span className="hidden text-gray-700 sm:inline">Hola, {sesion.nombre.split(" ")[0]}</span>
              <BotonSalir />
            </>
          ) : (
            <>
              <Link href="/login" className={enlace}>Iniciar sesión</Link>
              <Link href="/registro" className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-bold text-white hover:bg-red-600">Registrarme</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
