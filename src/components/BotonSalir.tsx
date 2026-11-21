"use client";
import { useRouter } from "next/navigation";
import { enviar } from "@/lib/cliente";
import { btnSec } from "@/lib/ui";

export default function BotonSalir() {
  const router = useRouter();
  return (
    <button
      className={btnSec}
      onClick={async () => {
        await enviar("/api/auth/logout", "POST");
        router.push("/");
        router.refresh();
      }}
    >
      Cerrar sesión
    </button>
  );
}
