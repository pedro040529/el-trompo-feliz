import bcrypt from "bcryptjs";
import { Schema, model, models, type HydratedDocument, type Model } from "mongoose";

export interface IUsuario {
  nombre: string;
  correo: string;
  passwordHash: string;
  rol: "CLIENTE" | "ADMIN";
  telefono: string;
  direccion: string;
  resetTokenHash?: string;
  resetExpira?: Date;
}

interface IUsuarioMetodos {
  verificarPassword(plano: string): Promise<boolean>;
}

type UsuarioModel = Model<IUsuario, object, IUsuarioMetodos>;
export type UsuarioDoc = HydratedDocument<IUsuario, IUsuarioMetodos>;

const usuarioSchema = new Schema<IUsuario, UsuarioModel, IUsuarioMetodos>(
  {
    nombre: { type: String, required: true, trim: true },
    correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    rol: { type: String, enum: ["CLIENTE", "ADMIN"], default: "CLIENTE" },
    telefono: { type: String, default: "" },
    direccion: { type: String, default: "" },
    resetTokenHash: String,
    resetExpira: Date,
  },
  { timestamps: true },
);

usuarioSchema.method("verificarPassword", function (plano: string) {
  return bcrypt.compare(plano, this.passwordHash);
});

export const Usuario = (models.Usuario as UsuarioModel) || model<IUsuario, UsuarioModel>("Usuario", usuarioSchema);
