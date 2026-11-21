import { manejar, leerJson } from "@/lib/http";
import { exigirSesion } from "@/lib/auth";
import { ServicioCompra } from "@/services/ServicioCompra";
import { urlBase } from "@/services/PasarelaStripe";

/** Reintenta el pago de un pedido pendiente. */
export async function POST(req: Request) {
  return manejar(async () => {
    const s = await exigirSesion();
    const { pedidoId } = (await leerJson(req)) as { pedidoId?: string };
    return ServicioCompra.iniciarPago(String(pedidoId ?? ""), s.id, urlBase(req));
  });
}
