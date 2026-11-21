import { manejar, leerJson } from "@/lib/http";
import { crearSesion } from "@/lib/auth";
import { loginSchema } from "@/lib/validaciones";
import { ServicioAuth } from "@/services/ServicioAuth";

export async function POST(req: Request) {
  return manejar(async () => {
    const { correo, password } = loginSchema.parse(await leerJson(req));
    const sesion = await ServicioAuth.iniciarSesion(correo, password);
    await crearSesion(sesion);
    return { nombre: sesion.nombre, rol: sesion.rol };
  });
}
