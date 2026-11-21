import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { conectarDB } from "@/lib/mongodb";
import { ErrorApp } from "@/lib/errores";
import { Usuario } from "@/models/Usuario";
import type { Sesion } from "@/lib/auth";

function aSesion(u: { _id: unknown; nombre: string; rol: "CLIENTE" | "ADMIN" }): Sesion {
  return { id: String(u._id), nombre: u.nombre, rol: u.rol };
}

export const ServicioAuth = {
  async registrar(datos: { nombre: string; correo: string; password: string; telefono: string }): Promise<Sesion> {
    await conectarDB();
    if (await Usuario.exists({ correo: datos.correo })) {
      throw new ErrorApp("Ya existe una cuenta con ese correo", 409);
    }
    const u = await Usuario.create({
      nombre: datos.nombre,
      correo: datos.correo,
      telefono: datos.telefono,
      passwordHash: await bcrypt.hash(datos.password, 10),
      rol: "CLIENTE",
    });
    return aSesion(u);
  },

  async iniciarSesion(correo: string, password: string): Promise<Sesion> {
    await conectarDB();
    const u = await Usuario.findOne({ correo });
    if (!u || !(await u.verificarPassword(password))) {
      throw new ErrorApp("Correo o contraseña incorrectos", 401);
    }
    return aSesion(u);
  },

  /** Genera un token de recuperación (1 hora). Devuelve el token en claro para enviarlo por correo. */
  async solicitarRecuperacion(correo: string): Promise<string | null> {
    await conectarDB();
    const u = await Usuario.findOne({ correo });
    if (!u) return null;
    const token = crypto.randomBytes(32).toString("hex");
    u.resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    u.resetExpira = new Date(Date.now() + 60 * 60 * 1000);
    await u.save();
    return token;
  },

  async restablecerPassword(token: string, password: string): Promise<void> {
    await conectarDB();
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    const u = await Usuario.findOne({ resetTokenHash: hash, resetExpira: { $gt: new Date() } });
    if (!u) throw new ErrorApp("El enlace no es válido o ya venció", 400);
    u.passwordHash = await bcrypt.hash(password, 10);
    u.resetTokenHash = undefined;
    u.resetExpira = undefined;
    await u.save();
  },
};
