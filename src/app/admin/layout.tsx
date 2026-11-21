import Link from "next/link";
import { paginaAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await paginaAdmin();
  const tab = "rounded-full px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-marca-50 hover:text-marca-600";
  return (
    <div className="space-y-5">
      <nav className="flex flex-wrap items-center gap-1 rounded-full border border-crema-100 bg-white p-2 shadow-sm">
        <span className="px-4 font-display text-base font-extrabold text-marca-600">⚙️ Panel</span>
        <Link href="/admin" className={tab}>Resumen</Link>
        <Link href="/admin/juguetes" className={tab}>Juguetes</Link>
        <Link href="/admin/categorias" className={tab}>Categorías</Link>
        <Link href="/admin/pedidos" className={tab}>Pedidos</Link>
      </nav>
      {children}
    </div>
  );
}
