import { manejar } from "@/lib/http";
import { ServicioCatalogo } from "@/services/ServicioCatalogo";

export async function GET() {
  return manejar(() => ServicioCatalogo.listarCategorias());
}
