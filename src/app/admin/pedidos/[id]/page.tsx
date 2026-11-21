import Link from "next/link";
import CambiarEstado from "@/components/CambiarEstado";
import DetallePedido from "@/components/DetallePedido";
import { o404 } from "@/lib/paginas";
import { card } from "@/lib/ui";
import { ServicioPedidos } from "@/services/ServicioPedidos";

export default async function AdminPedidoDetalle({ params }: { params: Promise<{ id: string }> }) {
  const pedido = await o404(ServicioPedidos.obtener((await params).id));
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href="/admin/pedidos" className="text-sm font-semibold text-sky-700 hover:underline">← Pedidos</Link>
      <DetallePedido p={pedido} admin />
      <div className={card}>
        <h3 className="mb-3 font-extrabold">Cambiar estado</h3>
        <CambiarEstado id={pedido.id} estado={pedido.estado} />
      </div>
    </div>
  );
}
