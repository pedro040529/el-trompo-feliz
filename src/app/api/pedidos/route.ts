import { manejar } from "@/lib/http";
import { exigirSesion } from "@/lib/auth";
import { ServicioPedidos } from "@/services/ServicioPedidos";

export async function GET() {
  return manejar(async () => ServicioPedidos.listarPorCliente((await exigirSesion()).id));
}
