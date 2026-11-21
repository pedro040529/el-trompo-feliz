import { Schema, model, models, Types, type Model } from "mongoose";

export interface IJuguete {
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  edadMinima: number;
  edadMaxima: number;
  stock: number;
  categoria: Types.ObjectId;
}

const jugueteSchema = new Schema<IJuguete>(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true, min: 0 },
    imagenUrl: { type: String, default: "" },
    edadMinima: { type: Number, required: true, min: 0 },
    edadMaxima: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    categoria: { type: Schema.Types.ObjectId, ref: "Categoria", required: true, index: true },
  },
  { timestamps: true },
);
jugueteSchema.index({ nombre: 1 });

export const Juguete = (models.Juguete as Model<IJuguete>) || model<IJuguete>("Juguete", jugueteSchema);
