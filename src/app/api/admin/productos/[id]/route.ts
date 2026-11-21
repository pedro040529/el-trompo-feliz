import { manejar, leerJson } from "@/lib/http";
import { exigirAdmin } from "@/lib/auth";
import { jugueteSchema, stockSchema } from "@/lib/validaciones";
import { ServicioCatalogo } from "@/services/ServicioCatalogo";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  return manejar(async () => {
    await exigirAdmin();
    return ServicioCatalogo.actualizarJuguete((await params).id, jugueteSchema.parse(await leerJson(req)));
  });
}

// Actualiza solo el stock.
export async function PATCH(req: Request, { params }: Ctx) {
  return manejar(async () => {
    await exigirAdmin();
    const { stock } = stockSchema.parse(await leerJson(req));
    return ServicioCatalogo.actualizarStock((await params).id, stock);
  });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  return manejar(async () => {
    await exigirAdmin();
    await ServicioCatalogo.eliminarJuguete((await params).id);
    return { ok: true };
  });
}
