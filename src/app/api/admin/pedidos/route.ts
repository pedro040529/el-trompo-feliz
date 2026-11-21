import { manejar } from "@/lib/http";
import { exigirAdmin } from "@/lib/auth";
import { ServicioPedidos } from "@/services/ServicioPedidos";

export async function GET(req: Request) {
  return manejar(async () => {
    await exigirAdmin();
    return ServicioPedidos.listarTodos(new URL(req.url).searchParams.get("estado") ?? undefined);
  });
}
