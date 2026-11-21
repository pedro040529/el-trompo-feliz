import Link from "next/link";
import { LogoTrompo } from "./ilustraciones";

export default function Footer() {
  const enlace = "text-sm text-white/70 transition hover:text-white";
  return (
    <footer className="mt-12">
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="block h-8 w-full text-tinta sm:h-12" aria-hidden="true">
        <path fill="currentColor" d="M0 48V24c60 20 120 20 180 0s120-20 180 0 120 20 180 0 120-20 180 0 120 20 180 0 120-20 180 0 120 20 180 0 120-20 180 0V48z" />
      </svg>
      <div className="bg-tinta text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className="flex items-center gap-2 font-display text-xl font-extrabold">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-marca-500 p-1.5"><LogoTrompo className="h-full w-full" /></span>
              El Trompo Feliz
            </p>
            <p className="text-sm text-white/70">Juguetería con más de una tienda: ahora también en línea. Elige, paga seguro y recibe en casa.</p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-yellow-300">Tienda</h3>
            <ul className="space-y-2">
              <li><Link href="/#catalogo" className={enlace}>Todos los juguetes</Link></li>
              <li><Link href="/carrito" className={enlace}>Mi carrito</Link></li>
              <li><Link href="/pedidos" className={enlace}>Mis pedidos</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-yellow-300">Mi cuenta</h3>
            <ul className="space-y-2">
              <li><Link href="/login" className={enlace}>Iniciar sesión</Link></li>
              <li><Link href="/registro" className={enlace}>Crear cuenta</Link></li>
              <li><Link href="/recuperar" className={enlace}>Recuperar contraseña</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-yellow-300">Pagos seguros</h3>
            <p className="text-sm text-white/70">Pagamos con tarjeta a través de Stripe. Nunca guardamos los datos de tu tarjeta.</p>
            <div className="mt-3 flex gap-2 text-xs font-extrabold">
              <span className="rounded-md bg-white px-2 py-1 text-sky-900">VISA</span>
              <span className="rounded-md bg-white px-2 py-1 text-marca-600">Mastercard</span>
              <span className="rounded-md bg-white px-2 py-1 text-violet-700">stripe</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
          © {new Date().getFullYear()} El Trompo Feliz · Juguetería · Hecho con ❤️ para jugar
        </div>
      </div>
    </footer>
  );
}
