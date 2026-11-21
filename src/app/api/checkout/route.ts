import { manejar, leerJson } from "@/lib/http";
import { exigirSesion } from "@/lib/auth";
import { entregaSchema } from "@/lib/validaciones";
import { ServicioCompra } from "@/services/ServicioCompra";

/** Crea el pedido PENDIENTE y devuelve la URL de pago de Stripe. */
export async function POST(req: Request) {
  return manejar(async () => {
    const s = await exigirSesion();
    const datos = entregaSchema.parse(await leerJson(req));
    const pedido = await ServicioCompra.iniciarCompra(s.id, datos);
    try {
      return await ServicioCompra.iniciarPago(pedido.id, s.id);
    } catch {
      // El pedido queda pendiente; el cliente puede reintentar el pago desde su confirmación.
      return { id: pedido.id, url: null };
    }
  }, 201);
}
