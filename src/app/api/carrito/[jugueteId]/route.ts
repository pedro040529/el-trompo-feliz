import { manejar, leerJson } from "@/lib/http";
import { exigirSesion } from "@/lib/auth";
import { cantidadSchema } from "@/lib/validaciones";
import { ServicioCarrito } from "@/services/ServicioCarrito";

type Ctx = { params: Promise<{ jugueteId: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  return manejar(async () => {
    const s = await exigirSesion();
    const { cantidad } = cantidadSchema.parse(await leerJson(req));
    return ServicioCarrito.cambiarCantidad(s.id, (await params).jugueteId, cantidad);
  });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  return manejar(async () => {
    const s = await exigirSesion();
    return ServicioCarrito.quitar(s.id, (await params).jugueteId);
  });
}
