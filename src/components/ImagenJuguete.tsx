import Image from "next/image";

export default function ImagenJuguete({ url, nombre, grande = false }: { url: string; nombre: string; grande?: boolean }) {
  const caja = grande ? "aspect-square w-full" : "aspect-square w-full";
  if (!url) {
    return (
      <div className={`${caja} flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-red-100 ${grande ? "text-8xl" : "text-6xl"}`} aria-label={nombre}>
        🧸
      </div>
    );
  }
  return (
    <div className={`${caja} relative overflow-hidden rounded-xl bg-amber-50`}>
      <Image src={url} alt={nombre} fill sizes={grande ? "(max-width: 768px) 100vw, 480px" : "(max-width: 768px) 50vw, 280px"} className="object-cover" unoptimized />
    </div>
  );
}
