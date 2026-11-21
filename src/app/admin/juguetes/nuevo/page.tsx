import AdminJugueteForm from "@/components/AdminJugueteForm";
import { ServicioCatalogo } from "@/services/ServicioCatalogo";
import Link from "next/link";

export default async function NuevoJuguete() {
  const categorias = await ServicioCatalogo.listarCategorias();
  if (categorias.length === 0) {
    return <p className="rounded-xl bg-amber-100 p-4">Primero crea una categoría en <Link className="font-bold underline" href="/admin/categorias">Categorías</Link>.</p>;
  }
  return <AdminJugueteForm categorias={categorias} />;
}
