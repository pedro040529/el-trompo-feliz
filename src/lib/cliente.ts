"use client";

export async function enviar<T = unknown>(
  url: string,
  metodo: "POST" | "PUT" | "PATCH" | "DELETE",
  cuerpo?: unknown,
): Promise<{ ok: true; data: T } | { ok: false; error: string; status: number }> {
  try {
    const r = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, error: data.error ?? "No se pudo completar la acción", status: r.status };
    return { ok: true, data: data as T };
  } catch {
    return { ok: false, error: "No hay conexión con el servidor", status: 0 };
  }
}
