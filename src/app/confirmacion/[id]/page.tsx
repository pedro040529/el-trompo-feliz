import Link from "next/link";
import BotonPagar from "@/components/BotonPagar";
import DetallePedido from "@/components/DetallePedido";
import { paginaCliente } from "@/lib/auth";
import { btn } from "@/lib/ui";
import { ServicioPedidos } from "@/services/ServicioPedidos";
import { ServicioCompra } from "@/services/ServicioCompra";
import { o404 } from "@/lib/paginas";

export const dynamic = "force-dynamic";

export default async function Confirmacion({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string; pago?: string }>;
}) {
  const s = await paginaCliente();
  const { id } = await params;
  const { session_id, pago } = await searchParams;
  let pedido = await o404(ServicioPedidos.obtener(id, s.id));
  // Al volver de Stripe, confirma el pago sin depender del webhook.
  if (pedido.estado === "PENDIENTE" && session_id) {
    try {
      if (await ServicioCompra.sincronizarPago(id, session_id)) pedido = await o404(ServicioPedidos.obtener(id, s.id));
    } catch {
      /* si falla, el pedido sigue pendiente y puede reintentar */
    }
  }
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-3xl bg-green-100 p-6 text-center">
        <p className="text-5xl">🎉</p>
        <h1 className="mt-2 text-2xl font-extrabold text-green-900">¡Recibimos tu pedido!</h1>
        <p className="mt-1 text-green-900">
          {pedido.estado === "PENDIENTE"
            ? pago === "cancelado"
              ? "El pago fue cancelado. Tu pedido sigue pendiente: puedes pagarlo cuando quieras."
              : "Tu pedido está registrado y pendiente de pago."
            : "Tu pago fue confirmado. Estamos preparando tu pedido."}
        </p>
      </div>
      <DetallePedido p={pedido} />
      {pedido.estado === "PENDIENTE" && <BotonPagar pedidoId={pedido.id} />}
      <div className="flex gap-3">
        <Link href="/pedidos" className={btn}>Ver mis pedidos</Link>
        <Link href="/" className="inline-flex items-center px-4 text-sm font-semibold text-sky-700 hover:underline">Seguir comprando</Link>
      </div>
    </div>
  );
}
