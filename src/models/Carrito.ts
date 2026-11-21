import { Schema, model, models, Types, type Model } from "mongoose";

export interface IItemCarrito {
  juguete: Types.ObjectId;
  cantidad: number;
}

export interface ICarrito {
  cliente: Types.ObjectId;
  items: IItemCarrito[];
}

const carritoSchema = new Schema<ICarrito>(
  {
    cliente: { type: Schema.Types.ObjectId, ref: "Usuario", required: true, unique: true },
    items: [
      {
        _id: false,
        juguete: { type: Schema.Types.ObjectId, ref: "Juguete", required: true },
        cantidad: { type: Number, required: true, min: 1 },
      },
    ],
  },
  { timestamps: true },
);

export const Carrito = (models.Carrito as Model<ICarrito>) || model<ICarrito>("Carrito", carritoSchema);
