import Link from "next/link";
import BotonPagar from "@/components/BotonPagar";
import DetallePedido from "@/components/DetallePedido";
import { paginaCliente } from "@/lib/auth";
import { ServicioPedidos } from "@/services/ServicioPedidos";
import { o404 } from "@/lib/paginas";

export const dynamic = "force-dynamic";

export default async function PedidoDetalle({ params }: { params: Promise<{ id: string }> }) {
  const s = await paginaCliente();
  const pedido = await o404(ServicioPedidos.obtener((await params).id, s.id));
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href="/pedidos" className="text-sm font-semibold text-sky-700 hover:underline">← Mis pedidos</Link>
      <DetallePedido p={pedido} />
      {pedido.estado === "PENDIENTE" && <BotonPagar pedidoId={pedido.id} />}
    </div>
  );
}
