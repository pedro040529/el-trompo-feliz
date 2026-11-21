import { manejar } from "@/lib/http";
import { ServicioCatalogo } from "@/services/ServicioCatalogo";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return manejar(async () => ServicioCatalogo.obtener((await params).id));
}
