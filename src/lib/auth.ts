import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ErrorApp } from "./errores";
import type { Rol } from "./tipos";

const COOKIE = "trompo_session";
const SIETE_DIAS = 60 * 60 * 24 * 7;

export interface Sesion {
  id: string;
  nombre: string;
  rol: Rol;
}

function clave() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("Falta AUTH_SECRET (mínimo 16 caracteres) en .env.local");
  return new TextEncoder().encode(s);
}

export async function crearSesion(s: Sesion) {
  const token = await new SignJWT({ nombre: s.nombre, rol: s.rol })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(s.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(clave());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SIETE_DIAS,
  });
}

export async function cerrarSesion() {
  (await cookies()).delete(COOKIE);
}

export async function obtenerSesion(): Promise<Sesion | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, clave());
    if (!payload.sub) return null;
    return { id: payload.sub, nombre: String(payload.nombre ?? ""), rol: payload.rol === "ADMIN" ? "ADMIN" : "CLIENTE" };
  } catch {
    return null;
  }
}

/** Para rutas API: lanza 401/403. */
export async function exigirSesion(): Promise<Sesion> {
  const s = await obtenerSesion();
  if (!s) throw new ErrorApp("Debes iniciar sesión", 401);
  return s;
}

export async function exigirAdmin(): Promise<Sesion> {
  const s = await exigirSesion();
  if (s.rol !== "ADMIN") throw new ErrorApp("No tienes permisos para esta acción", 403);
  return s;
}

/** Para páginas: redirige. */
export async function paginaCliente(destino = "/login"): Promise<Sesion> {
  const s = await obtenerSesion();
  if (!s) redirect(destino);
  return s;
}

export async function paginaAdmin(): Promise<Sesion> {
  const s = await obtenerSesion();
  if (!s) redirect("/login?siguiente=/admin");
  if (s.rol !== "ADMIN") redirect("/");
  return s;
}
