import { manejar } from "@/lib/http";
import { PasarelaStripe } from "@/services/PasarelaStripe";
import { ServicioCompra } from "@/services/ServicioCompra";

/** Stripe avisa aquí cuando un pago se completa. */
export async function POST(req: Request) {
  return manejar(async () => {
    const evento = PasarelaStripe.evento(await req.text(), req.headers.get("stripe-signature"));
    if (evento.type === "checkout.session.completed" || evento.type === "checkout.session.async_payment_succeeded") {
      const s = evento.data.object;
      const pedidoId = s.metadata?.pedidoId;
      if (pedidoId && s.payment_status === "paid") {
        const ref = typeof s.payment_intent === "string" ? s.payment_intent : s.id;
        await ServicioCompra.confirmarPago(pedidoId, ref);
      }
    }
    return { recibido: true };
  });
}
