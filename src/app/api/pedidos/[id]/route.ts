import { manejar } from "@/lib/http";
import { exigirSesion } from "@/lib/auth";
import { ServicioPedidos } from "@/services/ServicioPedidos";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return manejar(async () => ServicioPedidos.obtener((await params).id, (await exigirSesion()).id));
}
