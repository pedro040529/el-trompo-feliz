import { redirect } from "next/navigation";
import { FormLogin } from "@/components/FormAuth";
import { obtenerSesion } from "@/lib/auth";

export default async function Login({ searchParams }: { searchParams: Promise<{ siguiente?: string }> }) {
  if (await obtenerSesion()) redirect("/");
  const { siguiente } = await searchParams;
  return <FormLogin siguiente={siguiente} />;
}
