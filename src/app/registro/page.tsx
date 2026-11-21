import { redirect } from "next/navigation";
import { FormRegistro } from "@/components/FormAuth";
import { obtenerSesion } from "@/lib/auth";

export default async function Registro() {
  if (await obtenerSesion()) redirect("/");
  return <FormRegistro />;
}
