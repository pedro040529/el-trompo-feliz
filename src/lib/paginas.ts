import { notFound } from "next/navigation";
import { ErrorApp } from "./errores";

/** Convierte un ErrorApp 404 de un servicio en la página 404 de Next. */
export async function o404<T>(p: Promise<T>): Promise<T> {
  try {
    return await p;
  } catch (e) {
    if (e instanceof ErrorApp && e.status === 404) notFound();
    throw e;
  }
}
