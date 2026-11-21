import { manejar, leerJson } from "@/lib/http";
import { crearSesion } from "@/lib/auth";
import { registroSchema } from "@/lib/validaciones";
import { ServicioAuth } from "@/services/ServicioAuth";

export async function POST(req: Request) {
  return manejar(async () => {
    const datos = registroSchema.parse(await leerJson(req));
    const sesion = await ServicioAuth.registrar(datos);
    await crearSesion(sesion);
    return { nombre: sesion.nombre, rol: sesion.rol };
  }, 201);
}
