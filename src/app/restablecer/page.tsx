import Link from "next/link";
import { FormRestablecer } from "@/components/FormAuth";

export default async function Restablecer({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  if (!token) {
    return (
      <p className="text-center">
        Enlace no válido. <Link href="/recuperar" className="font-semibold text-sky-700 underline">Solicita uno nuevo</Link>.
      </p>
    );
  }
  return <FormRestablecer token={token} />;
}
