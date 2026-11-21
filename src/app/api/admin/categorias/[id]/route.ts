import { manejar, leerJson } from "@/lib/http";
import { exigirAdmin } from "@/lib/auth";
import { categoriaSchema } from "@/lib/validaciones";
import { ServicioCatalogo } from "@/services/ServicioCatalogo";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  return manejar(async () => {
    await exigirAdmin();
    return ServicioCatalogo.actualizarCategoria((await params).id, categoriaSchema.parse(await leerJson(req)));
  });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  return manejar(async () => {
    await exigirAdmin();
    await ServicioCatalogo.eliminarCategoria((await params).id);
    return { ok: true };
  });
}
