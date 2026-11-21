import Link from "next/link";
import { InsigniaEstado } from "@/components/DetallePedido";
import { ESTADOS, ETIQUETA_ESTADO, formatoPrecio } from "@/lib/constantes";
import { card } from "@/lib/ui";
import { ServicioPedidos } from "@/services/ServicioPedidos";

export default async function AdminPedidos({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  const pedidos = await ServicioPedidos.listarTodos(estado);
  const chip = (activo: boolean) => `rounded-full px-3 py-1 text-sm font-semibold ${activo ? "bg-red-500 text-white" : "bg-white text-gray-700 hover:bg-amber-100"} border border-amber-200`;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Pedidos</h1>
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/pedidos" className={chip(!estado)}>Todos</Link>
        {ESTADOS.map((e) => <Link key={e} href={`/admin/pedidos?estado=${e}`} className={chip(estado === e)}>{ETIQUETA_ESTADO[e]}</Link>)}
      </div>
      <div className={`${card} overflow-x-auto p-0`}>
        <table className="w-full text-left text-sm">
          <thead className="bg-amber-100 text-xs uppercase text-gray-600">
            <tr><th className="p-3">Pedido</th><th className="p-3">Fecha</th><th className="p-3">Cliente</th><th className="p-3">Total</th><th className="p-3">Estado</th><th className="p-3" /></tr>
          </thead>
          <tbody className="divide-y divide-amber-100">
            {pedidos.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-gray-500">No hay pedidos.</td></tr>}
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td className="p-3 font-semibold">{p.numero}</td>
                <td className="p-3">{new Date(p.fecha).toLocaleDateString("es-PE")}</td>
                <td className="p-3">{p.cliente?.nombre ?? "—"}</td>
                <td className="p-3">{formatoPrecio(p.total)}</td>
                <td className="p-3"><InsigniaEstado estado={p.estado} /></td>
                <td className="p-3 text-right"><Link href={`/admin/pedidos/${p.id}`} className="font-semibold text-sky-700 hover:underline">Ver</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
