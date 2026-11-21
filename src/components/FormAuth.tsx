"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { enviar } from "@/lib/cliente";
import { btn, card, etiqueta, input } from "@/lib/ui";

function destinoSeguro(s?: string) {
  return s && s.startsWith("/") && !s.startsWith("//") ? s : null;
}

export function FormLogin({ siguiente }: { siguiente?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviarForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setCargando(true);
    setError("");
    const r = await enviar<{ rol: string }>("/api/auth/login", "POST", { correo: f.get("correo"), password: f.get("password") });
    setCargando(false);
    if (!r.ok) return setError(r.error);
    router.push(destinoSeguro(siguiente) ?? (r.data.rol === "ADMIN" ? "/admin" : "/"));
    router.refresh();
  }

  return (
    <form onSubmit={enviarForm} className={`${card} mx-auto max-w-md space-y-4`}>
      <h1 className="text-2xl font-extrabold">Iniciar sesión</h1>
      <div>
        <label className={etiqueta} htmlFor="correo">Correo</label>
        <input id="correo" name="correo" type="email" required autoComplete="email" className={input} />
      </div>
      <div>
        <label className={etiqueta} htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={input} />
      </div>
      {error && <p className="text-sm font-semibold text-rose-600" role="alert">{error}</p>}
      <button className={`${btn} w-full`} disabled={cargando}>{cargando ? "Ingresando…" : "Ingresar"}</button>
      <p className="text-center text-sm text-gray-600">
        <Link href="/recuperar" className="font-semibold text-sky-700 hover:underline">¿Olvidaste tu contraseña?</Link>
        {" · "}
        <Link href="/registro" className="font-semibold text-sky-700 hover:underline">Crear cuenta</Link>
      </p>
    </form>
  );
}

export function FormRegistro() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviarForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setCargando(true);
    setError("");
    const r = await enviar("/api/auth/registro", "POST", {
      nombre: f.get("nombre"),
      correo: f.get("correo"),
      telefono: f.get("telefono"),
      password: f.get("password"),
    });
    setCargando(false);
    if (!r.ok) return setError(r.error);
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={enviarForm} className={`${card} mx-auto max-w-md space-y-4`}>
      <h1 className="text-2xl font-extrabold">Crear cuenta</h1>
      <div>
        <label className={etiqueta} htmlFor="nombre">Nombre completo</label>
        <input id="nombre" name="nombre" required minLength={2} autoComplete="name" className={input} />
      </div>
      <div>
        <label className={etiqueta} htmlFor="correo">Correo</label>
        <input id="correo" name="correo" type="email" required autoComplete="email" className={input} />
      </div>
      <div>
        <label className={etiqueta} htmlFor="telefono">Teléfono (opcional)</label>
        <input id="telefono" name="telefono" type="tel" autoComplete="tel" className={input} />
      </div>
      <div>
        <label className={etiqueta} htmlFor="password">Contraseña (mínimo 8 caracteres)</label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className={input} />
      </div>
      {error && <p className="text-sm font-semibold text-rose-600" role="alert">{error}</p>}
      <button className={`${btn} w-full`} disabled={cargando}>{cargando ? "Creando…" : "Registrarme"}</button>
      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes cuenta? <Link href="/login" className="font-semibold text-sky-700 hover:underline">Inicia sesión</Link>
      </p>
    </form>
  );
}

export function FormRecuperar() {
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enlace, setEnlace] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviarForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setCargando(true);
    setError("");
    const r = await enviar<{ mensaje: string; enlaceDesarrollo?: string }>("/api/auth/recuperar", "POST", { correo: f.get("correo") });
    setCargando(false);
    if (!r.ok) return setError(r.error);
    setMensaje(r.data.mensaje);
    setEnlace(r.data.enlaceDesarrollo ?? "");
  }

  return (
    <form onSubmit={enviarForm} className={`${card} mx-auto max-w-md space-y-4`}>
      <h1 className="text-2xl font-extrabold">Recuperar contraseña</h1>
      <p className="text-sm text-gray-600">Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.</p>
      <div>
        <label className={etiqueta} htmlFor="correo">Correo</label>
        <input id="correo" name="correo" type="email" required className={input} />
      </div>
      {error && <p className="text-sm font-semibold text-rose-600" role="alert">{error}</p>}
      {mensaje && <p className="text-sm font-semibold text-green-700" role="status">{mensaje}</p>}
      {enlace && (
        <p className="rounded-xl bg-crema-50 p-3 text-xs text-gray-700">
          Modo desarrollo (aún no hay envío de correos): <Link href={enlace} className="font-bold text-sky-700 underline">abrir enlace de restablecimiento</Link>
        </p>
      )}
      <button className={`${btn} w-full`} disabled={cargando}>{cargando ? "Enviando…" : "Enviar enlace"}</button>
    </form>
  );
}

export function FormRestablecer({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [listo, setListo] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function enviarForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setCargando(true);
    setError("");
    const r = await enviar("/api/auth/recuperar", "PUT", { token, password: f.get("password") });
    setCargando(false);
    if (!r.ok) return setError(r.error);
    setListo(true);
    setTimeout(() => router.push("/login"), 1500);
  }

  return (
    <form onSubmit={enviarForm} className={`${card} mx-auto max-w-md space-y-4`}>
      <h1 className="text-2xl font-extrabold">Nueva contraseña</h1>
      <div>
        <label className={etiqueta} htmlFor="password">Nueva contraseña (mínimo 8 caracteres)</label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className={input} />
      </div>
      {error && <p className="text-sm font-semibold text-rose-600" role="alert">{error}</p>}
      {listo && <p className="text-sm font-semibold text-green-700" role="status">Contraseña actualizada. Redirigiendo al inicio de sesión…</p>}
      <button className={`${btn} w-full`} disabled={cargando || listo}>{cargando ? "Guardando…" : "Guardar contraseña"}</button>
    </form>
  );
}
