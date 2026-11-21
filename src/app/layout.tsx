import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "El Trompo Feliz — Juguetería",
  description: "Tienda virtual de juguetes El Trompo Feliz. Elige, compra y recibe en casa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
        <footer className="border-t border-amber-200 bg-amber-100 py-6 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} El Trompo Feliz · Juguetería
        </footer>
      </body>
    </html>
  );
}
