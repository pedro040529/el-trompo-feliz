import { manejar, leerJson } from "@/lib/http";
import { exigirAdmin } from "@/lib/auth";
import { categoriaSchema } from "@/lib/validaciones";
import { ServicioCatalogo } from "@/services/ServicioCatalogo";

export async function POST(req: Request) {
  return manejar(async () => {
    await exigirAdmin();
    return ServicioCatalogo.crearCategoria(categoriaSchema.parse(await leerJson(req)));
  }, 201);
}
