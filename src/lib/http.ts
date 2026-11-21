import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ErrorApp } from "./errores";

export async function manejar(fn: () => Promise<unknown>, status = 200) {
  try {
    const data = await fn();
    return NextResponse.json(data ?? { ok: true }, { status });
  } catch (e) {
    if (e instanceof ErrorApp) return NextResponse.json({ error: e.message }, { status: e.status });
    if (e instanceof ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message ?? "Datos no válidos" }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Ocurrió un error inesperado. Inténtalo de nuevo." }, { status: 500 });
  }
}

export async function leerJson(req: Request) {
  try {
    return await req.json();
  } catch {
    throw new ErrorApp("Solicitud no válida", 400);
  }
}
