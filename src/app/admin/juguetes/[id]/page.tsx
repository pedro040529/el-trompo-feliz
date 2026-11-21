import AdminJugueteForm from "@/components/AdminJugueteForm";
import { o404 } from "@/lib/paginas";
import { ServicioCatalogo } from "@/services/ServicioCatalogo";

export default async function EditarJuguete({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [categorias, juguete] = await Promise.all([ServicioCatalogo.listarCategorias(), o404(ServicioCatalogo.obtener(id))]);
  return <AdminJugueteForm categorias={categorias} juguete={juguete} />;
}
