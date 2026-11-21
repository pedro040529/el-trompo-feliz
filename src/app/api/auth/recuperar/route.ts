import { manejar, leerJson } from "@/lib/http";
import { recuperarSchema, nuevaPasswordSchema } from "@/lib/validaciones";
import { ServicioAuth } from "@/services/ServicioAuth";

// Paso 1: solicitar el enlace de recuperación.
export async function POST(req: Request) {
  return manejar(async () => {
    const { correo } = recuperarSchema.parse(await leerJson(req));
    const token = await ServicioAuth.solicitarRecuperacion(correo);
    const mensaje = "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.";
    // TODO: enviar el enlace por correo con un proveedor (Resend, etc.).
    // Mientras no exista proveedor, solo en desarrollo se devuelve el enlace para poder probar el flujo.
    if (token && process.env.NODE_ENV !== "production") {
      return { mensaje, enlaceDesarrollo: `/restablecer?token=${token}` };
    }
    return { mensaje };
  });
}

// Paso 2: fijar la nueva contraseña con el token.
export async function PUT(req: Request) {
  return manejar(async () => {
    const { token, password } = nuevaPasswordSchema.parse(await leerJson(req));
    await ServicioAuth.restablecerPassword(token, password);
    return { ok: true };
  });
}
