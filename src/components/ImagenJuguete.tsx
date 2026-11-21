import Image from "next/image";
import { FONDO, Ilustracion, tipoDe } from "./ilustraciones";

export default function ImagenJuguete({ url, nombre, grande = false }: { url: string; nombre: string; grande?: boolean }) {
  if (!url) {
    const tipo = tipoDe(nombre);
    return (
      <div
        className={`flex aspect-square w-full items-center justify-center rounded-2xl bg-gradient-to-br ${FONDO[tipo]} ${grande ? "p-10" : "p-5"}`}
        role="img"
        aria-label={nombre}
      >
        <Ilustracion tipo={tipo} className="h-full w-full drop-shadow-sm transition duration-300 group-hover:scale-105" />
      </div>
    );
  }
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-crema-50">
      <Image src={url} alt={nombre} fill sizes={grande ? "(max-width: 768px) 100vw, 560px" : "(max-width: 768px) 50vw, 280px"} className="object-cover" unoptimized />
    </div>
  );
}
