import Link from "next/link";

export default function NoEncontrado() {
  return (
    <div className="py-20 text-center">
      <p className="text-6xl">🪀</p>
      <h1 className="mt-4 text-2xl font-extrabold">No encontramos esa página</h1>
      <Link href="/" className="mt-4 inline-block font-semibold text-marca-600 hover:underline">Volver al inicio</Link>
    </div>
  );
}
