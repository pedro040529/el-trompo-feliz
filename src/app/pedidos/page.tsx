import Link from "next/link";
import { InsigniaEstado } from "@/components/DetallePedido";
import { paginaCliente } from "@/lib/auth";
import { formatoPrecio } from "@/lib/constantes";
import { btn, card } from "@/lib/ui";
import { ServicioPedidos } from "@/services/ServicioPedidos";

export const dynamic = "force-dynamic";

export default async function MisPedidos() {
  const s = await paginaCliente("/login?siguiente=/pedidos");
  const pedidos = await ServicioPedidos.listarPorCliente(s.id);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Mis pedidos</h1>
      {pedidos.length === 0 ? (
        <div className={`${card} py-12 text-center`}>
          <p className="text-lg font-bold">Aún no tienes pedidos</p>
          <Link href="/" className={`${btn} mt-4`}>Ver juguetes</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidos.map((p) => (
            <Link key={p.id} href={`/pedidos/${p.id}`} className={`${card} flex flex-wrap items-center justify-between gap-3 hover:shadow-md`}>
              <div>
                <p className="font-extrabold">{p.numero}</p>
                <p className="text-sm text-gray-500">
                  {new Date(p.fecha).toLocaleDateString("es-PE", { dateStyle: "long" })} · {p.items.reduce((n, i) => n + i.cantidad, 0)} producto(s)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <InsigniaEstado estado={p.estado} />
                <span className="font-extrabold text-marca-600">{formatoPrecio(p.total)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
