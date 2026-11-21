import { manejar, leerJson } from "@/lib/http";
import { exigirSesion } from "@/lib/auth";
import { agregarSchema } from "@/lib/validaciones";
import { ServicioCarrito } from "@/services/ServicioCarrito";

export async function GET() {
  return manejar(async () => ServicioCarrito.obtener((await exigirSesion()).id));
}

export async function POST(req: Request) {
  return manejar(async () => {
    const s = await exigirSesion();
    const { jugueteId, cantidad } = agregarSchema.parse(await leerJson(req));
    return ServicioCarrito.agregar(s.id, jugueteId, cantidad);
  });
}
