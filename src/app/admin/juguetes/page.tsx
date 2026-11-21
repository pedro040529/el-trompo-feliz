import Link from "next/link";
import StockInline from "@/components/StockInline";
import { STOCK_BAJO, formatoPrecio, textoEdad } from "@/lib/constantes";
import { btn, btnSec, card, input } from "@/lib/ui";
import { ServicioCatalogo } from "@/services/ServicioCatalogo";

export default async function AdminJuguetes({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const juguetes = await ServicioCatalogo.listarAdmin(q);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Juguetes</h1>
        <Link href="/admin/juguetes/nuevo" className={btn}>+ Registrar juguete</Link>
      </div>
      <form className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Buscar por nombre…" className={`${input} max-w-xs`} />
        <button className={btnSec}>Buscar</button>
      </form>
      <div className={`${card} overflow-x-auto p-0`}>
        <table className="w-full text-left text-sm">
          <thead className="bg-amber-100 text-xs uppercase text-gray-600">
            <tr><th className="p-3">Juguete</th><th className="p-3">Categoría</th><th className="p-3">Edad</th><th className="p-3">Precio</th><th className="p-3">Stock</th><th className="p-3" /></tr>
          </thead>
          <tbody className="divide-y divide-amber-100">
            {juguetes.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-gray-500">No hay juguetes registrados.</td></tr>}
            {juguetes.map((j) => (
              <tr key={j.id} className={j.stock <= STOCK_BAJO ? "bg-amber-50" : ""}>
                <td className="p-3 font-semibold">{j.nombre}</td>
                <td className="p-3">{j.categoria?.nombre ?? "—"}</td>
                <td className="p-3">{textoEdad(j.edadMinima, j.edadMaxima)}</td>
                <td className="p-3">{formatoPrecio(j.precio)}</td>
                <td className="p-3"><StockInline key={`${j.id}-${j.stock}`} id={j.id} stock={j.stock} /></td>
                <td className="p-3 text-right"><Link href={`/admin/juguetes/${j.id}`} className="font-semibold text-sky-700 hover:underline">Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
