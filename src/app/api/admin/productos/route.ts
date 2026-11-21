import { manejar, leerJson } from "@/lib/http";
import { exigirAdmin } from "@/lib/auth";
import { jugueteSchema } from "@/lib/validaciones";
import { ServicioCatalogo } from "@/services/ServicioCatalogo";

export async function POST(req: Request) {
  return manejar(async () => {
    await exigirAdmin();
    return ServicioCatalogo.crearJuguete(jugueteSchema.parse(await leerJson(req)));
  }, 201);
}
