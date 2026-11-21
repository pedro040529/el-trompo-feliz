import Link from "next/link";
import { paginaAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await paginaAdmin();
  const tab = "rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-amber-200";
  return (
    <div className="space-y-5">
      <nav className="flex flex-wrap items-center gap-1 rounded-2xl border border-amber-200 bg-white p-2">
        <span className="px-3 text-sm font-extrabold text-red-600">Panel</span>
        <Link href="/admin" className={tab}>Resumen</Link>
        <Link href="/admin/juguetes" className={tab}>Juguetes</Link>
        <Link href="/admin/categorias" className={tab}>Categorías</Link>
        <Link href="/admin/pedidos" className={tab}>Pedidos</Link>
      </nav>
      {children}
    </div>
  );
}
