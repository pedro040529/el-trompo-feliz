import { manejar, leerJson } from "@/lib/http";
import { exigirSesion } from "@/lib/auth";
import { entregaSchema } from "@/lib/validaciones";
import { ServicioCompra } from "@/services/ServicioCompra";

export async function POST(req: Request) {
  return manejar(async () => {
    const s = await exigirSesion();
    const datos = entregaSchema.parse(await leerJson(req));
    // El pedido se crea en estado PENDIENTE. El pago con Stripe se conecta aquí (último paso del proyecto).
    return ServicioCompra.iniciarCompra(s.id, datos);
  }, 201);
}
