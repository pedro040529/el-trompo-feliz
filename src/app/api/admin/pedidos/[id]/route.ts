import { manejar, leerJson } from "@/lib/http";
import { exigirAdmin } from "@/lib/auth";
import { estadoSchema } from "@/lib/validaciones";
import { ServicioPedidos } from "@/services/ServicioPedidos";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return manejar(async () => {
    await exigirAdmin();
    const { estado } = estadoSchema.parse(await leerJson(req));
    return ServicioPedidos.cambiarEstado((await params).id, estado);
  });
}
