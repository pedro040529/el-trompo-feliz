import { ETIQUETA_ESTADO, ESTADOS, formatoPrecio } from "@/lib/constantes";
import type { PedidoDTO } from "@/lib/tipos";
import { card } from "@/lib/ui";

export function InsigniaEstado({ estado }: { estado: PedidoDTO["estado"] }) {
  const color = { PENDIENTE: "bg-amber-200 text-amber-900", PAGADO: "bg-sky-200 text-sky-900", ENVIADO: "bg-indigo-200 text-indigo-900", ENTREGADO: "bg-green-200 text-green-900" }[estado];
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>{ETIQUETA_ESTADO[estado]}</span>;
}

export default function DetallePedido({ p, admin = false }: { p: PedidoDTO; admin?: boolean }) {
  const paso = ESTADOS.indexOf(p.estado);
  return (
    <div className="space-y-4">
      <div className={`${card} space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold">Pedido {p.numero}</h2>
            <p className="text-sm text-gray-500">{new Date(p.fecha).toLocaleString("es-PE", { dateStyle: "long", timeStyle: "short" })}</p>
          </div>
          <InsigniaEstado estado={p.estado} />
        </div>
        <ol className="flex items-center gap-2 text-xs font-semibold" aria-label="Progreso del pedido">
          {ESTADOS.map((e, i) => (
            <li key={e} className="flex flex-1 flex-col items-center gap-1">
              <span className={`h-2 w-full rounded-full ${i <= paso ? "bg-red-500" : "bg-gray-200"}`} />
              <span className={i <= paso ? "text-red-600" : "text-gray-400"}>{ETIQUETA_ESTADO[e]}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className={card}>
        <h3 className="mb-3 font-extrabold">Productos</h3>
        <ul className="divide-y divide-amber-100">
          {p.items.map((i) => (
            <li key={i.jugueteId} className="flex justify-between py-2 text-sm">
              <span>{i.cantidad} × {i.nombre} <span className="text-gray-400">({formatoPrecio(i.precioUnitario)} c/u)</span></span>
              <span className="font-semibold">{formatoPrecio(i.subtotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-amber-100 pt-3 text-lg font-extrabold">
          <span>Total</span><span className="text-red-600">{formatoPrecio(p.total)}</span>
        </div>
      </div>
      <div className={`${card} text-sm`}>
        <h3 className="mb-2 font-extrabold">Entrega</h3>
        <p>{p.datosEntrega.nombre} · {p.datosEntrega.telefono}</p>
        <p>{p.datosEntrega.direccion}, {p.datosEntrega.distrito}</p>
        {p.datosEntrega.referencia && <p className="text-gray-500">Ref.: {p.datosEntrega.referencia}</p>}
        {admin && p.cliente && <p className="mt-2 text-gray-500">Cliente: {p.cliente.nombre} ({p.cliente.correo})</p>}
      </div>
    </div>
  );
}
