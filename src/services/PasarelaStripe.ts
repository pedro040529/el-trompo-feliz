import Stripe from "stripe";
import { ErrorApp } from "@/lib/errores";

let cliente: Stripe | null = null;

function stripe() {
  const clave = process.env.STRIPE_SECRET_KEY;
  if (!clave) throw new ErrorApp("El pago con tarjeta aún no está configurado (falta STRIPE_SECRET_KEY)", 503);
  cliente ??= new Stripe(clave);
  return cliente;
}

export function urlBase() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

export interface ItemPago {
  nombre: string;
  precioUnitario: number;
  cantidad: number;
}

/** Pasarela de pago: encapsula Stripe (modo sandbox con claves sk_test_). */
export const PasarelaStripe = {
  async crearSesion(pedidoId: string, numero: string, items: ItemPago[]) {
    const sesion = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: items.map((i) => ({
        quantity: i.cantidad,
        price_data: {
          currency: "pen",
          unit_amount: Math.round(i.precioUnitario * 100),
          product_data: { name: i.nombre },
        },
      })),
      client_reference_id: pedidoId,
      metadata: { pedidoId, numero },
      success_url: `${urlBase()}/confirmacion/${pedidoId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${urlBase()}/confirmacion/${pedidoId}?pago=cancelado`,
    });
    if (!sesion.url) throw new ErrorApp("No se pudo iniciar el pago", 502);
    return { sessionId: sesion.id, url: sesion.url };
  },

  async consultarSesion(sessionId: string) {
    const s = await stripe().checkout.sessions.retrieve(sessionId);
    return {
      pagada: s.payment_status === "paid",
      pedidoId: s.metadata?.pedidoId ?? s.client_reference_id ?? "",
      referencia: typeof s.payment_intent === "string" ? s.payment_intent : (s.payment_intent?.id ?? s.id),
    };
  },

  /** Valida la firma del webhook y devuelve el evento. */
  evento(cuerpo: string, firma: string | null) {
    const secreto = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secreto || !firma) throw new ErrorApp("Webhook no configurado", 400);
    try {
      return stripe().webhooks.constructEvent(cuerpo, firma, secreto);
    } catch {
      throw new ErrorApp("Firma no válida", 400);
    }
  },
};
