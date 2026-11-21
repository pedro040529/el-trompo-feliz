import Link from "next/link";
import DetallePedido from "@/components/DetallePedido";
import { paginaCliente } from "@/lib/auth";
import { btn } from "@/lib/ui";
import { ServicioPedidos } from "@/services/ServicioPedidos";
import { o404 } from "@/lib/paginas";

export const dynamic = "force-dynamic";

export default async function Confirmacion({ params }: { params: Promise<{ id: string }> }) {
  const s = await paginaCliente();
  const pedido = await o404(ServicioPedidos.obtener((await params).id, s.id));
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-3xl bg-green-100 p-6 text-center">
        <p className="text-5xl">🎉</p>
        <h1 className="mt-2 text-2xl font-extrabold text-green-900">¡Recibimos tu pedido!</h1>
        <p className="mt-1 text-green-900">
          {pedido.estado === "PENDIENTE"
            ? "Tu pedido está registrado y pendiente de pago. Te avisaremos cuando se confirme."
            : "Tu pago fue confirmado. Estamos preparando tu pedido."}
        </p>
      </div>
      <DetallePedido p={pedido} />
      <div className="flex gap-3">
        <Link href="/pedidos" className={btn}>Ver mis pedidos</Link>
        <Link href="/" className="inline-flex items-center px-4 text-sm font-semibold text-sky-700 hover:underline">Seguir comprando</Link>
      </div>
    </div>
  );
}
