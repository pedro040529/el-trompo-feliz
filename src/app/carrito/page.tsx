import CarritoCliente from "@/components/CarritoCliente";
import { paginaCliente } from "@/lib/auth";
import { ServicioCarrito } from "@/services/ServicioCarrito";

export const dynamic = "force-dynamic";

export default async function PaginaCarrito() {
  const s = await paginaCliente("/login?siguiente=/carrito");
  const carrito = await ServicioCarrito.obtener(s.id);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Mi carrito</h1>
      <CarritoCliente inicial={carrito} />
    </div>
  );
}
