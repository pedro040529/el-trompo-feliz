import Link from "next/link";
import { ESTADOS, ETIQUETA_ESTADO, STOCK_BAJO, formatoPrecio } from "@/lib/constantes";
import { card } from "@/lib/ui";
import { ServicioCatalogo } from "@/services/ServicioCatalogo";
import { ServicioPedidos } from "@/services/ServicioPedidos";

export default async function AdminResumen() {
  const [r, bajo] = await Promise.all([ServicioPedidos.resumenAdmin(), ServicioCatalogo.stockBajo()]);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Resumen de la tienda</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={card}><p className="text-sm text-gray-500">Ventas (pedidos pagados)</p><p className="text-2xl font-extrabold text-red-600">{formatoPrecio(r.ventasTotal)}</p><p className="text-xs text-gray-400">{r.pedidosPagados} pedido(s)</p></div>
        {ESTADOS.map((e) => (
          <Link key={e} href={`/admin/pedidos?estado=${e}`} className={`${card} hover:shadow-md`}>
            <p className="text-sm text-gray-500">Pedidos {ETIQUETA_ESTADO[e].toLowerCase()}s</p>
            <p className="text-2xl font-extrabold">{r.pedidosPorEstado[e]}</p>
          </Link>
        ))}
      </div>
      <section className={card}>
        <h2 className="mb-3 text-lg font-extrabold">⚠️ Alertas de stock bajo (≤ {STOCK_BAJO} unidades)</h2>
        {bajo.length === 0 ? (
          <p className="text-sm text-gray-500">Todo el catálogo tiene stock suficiente.</p>
        ) : (
          <ul className="divide-y divide-amber-100">
            {bajo.map((j) => (
              <li key={j.id} className="flex items-center justify-between py-2 text-sm">
                <Link href={`/admin/juguetes/${j.id}`} className="font-semibold hover:text-red-600">{j.nombre}</Link>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${j.stock === 0 ? "bg-gray-200 text-gray-700" : "bg-amber-200 text-amber-900"}`}>
                  {j.stock === 0 ? "Agotado" : `Quedan ${j.stock}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
