import { Schema, model, models, type Model } from "mongoose";

export interface ICategoria {
  nombre: string;
  descripcion: string;
}

const categoriaSchema = new Schema<ICategoria>(
  {
    nombre: { type: String, required: true, unique: true, trim: true },
    descripcion: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Categoria = (models.Categoria as Model<ICategoria>) || model<ICategoria>("Categoria", categoriaSchema);
