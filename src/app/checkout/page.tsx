import Link from "next/link";
import { redirect } from "next/navigation";
import FormCheckout from "@/components/FormCheckout";
import { paginaCliente } from "@/lib/auth";
import { formatoPrecio } from "@/lib/constantes";
import { card } from "@/lib/ui";
import { conectarDB } from "@/lib/mongodb";
import { Usuario } from "@/models/Usuario";
import { ServicioCarrito } from "@/services/ServicioCarrito";

export const dynamic = "force-dynamic";

export default async function Checkout() {
  const s = await paginaCliente("/login?siguiente=/checkout");
  const carrito = await ServicioCarrito.obtener(s.id);
  if (carrito.items.length === 0 || carrito.hayProblemas) redirect("/carrito");
  await conectarDB();
  const u = await Usuario.findById(s.id).lean();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Finalizar compra</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <FormCheckout nombre={u?.nombre ?? s.nombre} telefono={u?.telefono ?? ""} direccion={u?.direccion ?? ""} />
        <aside className={`${card} h-fit space-y-2`}>
          <h2 className="text-lg font-extrabold">Tu pedido</h2>
          {carrito.items.map((i) => (
            <div key={i.jugueteId} className="flex justify-between text-sm">
              <span>{i.cantidad} × {i.nombre}</span>
              <span>{formatoPrecio(i.subtotal)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-crema-100 pt-2 text-lg font-extrabold">
            <span>Total</span><span className="text-marca-600">{formatoPrecio(carrito.total)}</span>
          </div>
          <Link href="/carrito" className="text-sm font-semibold text-sky-700 hover:underline">← Editar carrito</Link>
        </aside>
      </div>
    </div>
  );
}
