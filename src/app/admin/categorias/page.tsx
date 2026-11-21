import AdminCategorias from "@/components/AdminCategorias";
import { ServicioCatalogo } from "@/services/ServicioCatalogo";

export default async function PaginaCategorias() {
  const categorias = await ServicioCatalogo.listarCategorias();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Categorías</h1>
      <AdminCategorias categorias={categorias} />
    </div>
  );
}
