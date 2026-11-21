import { manejar } from "@/lib/http";
import { ServicioCatalogo } from "@/services/ServicioCatalogo";

export async function GET(req: Request) {
  return manejar(async () => {
    const p = new URL(req.url).searchParams;
    const num = (k: string) => (p.get(k) ? Number(p.get(k)) : undefined);
    return ServicioCatalogo.listar({
      q: p.get("q") ?? undefined,
      categoria: p.get("categoria") ?? undefined,
      edad: p.get("edad") ?? undefined,
      precioMin: num("precioMin"),
      precioMax: num("precioMax"),
      orden: (p.get("orden") as "recientes") ?? undefined,
      pagina: num("pagina"),
    });
  });
}
