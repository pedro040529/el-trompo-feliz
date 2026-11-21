import { Schema, model, models, Types, type Model } from "mongoose";
import { ESTADOS, type EstadoPedido } from "@/lib/constantes";

export interface IItemPedido {
  juguete: Types.ObjectId;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
}

export interface IPedido {
  numero: string;
  cliente: Types.ObjectId;
  items: IItemPedido[];
  total: number;
  estado: EstadoPedido;
  datosEntrega: { nombre: string; telefono: string; direccion: string; distrito: string; referencia: string };
  pago: { stripeSessionId?: string; referencia?: string; fecha?: Date };
  createdAt: Date;
}

const pedidoSchema = new Schema<IPedido>(
  {
    numero: { type: String, required: true, unique: true },
    cliente: { type: Schema.Types.ObjectId, ref: "Usuario", required: true, index: true },
    items: [
      {
        _id: false,
        juguete: { type: Schema.Types.ObjectId, ref: "Juguete", required: true },
        nombre: { type: String, required: true },
        precioUnitario: { type: Number, required: true },
        cantidad: { type: Number, required: true, min: 1 },
      },
    ],
    total: { type: Number, required: true },
    estado: { type: String, enum: ESTADOS, default: "PENDIENTE", index: true },
    datosEntrega: {
      nombre: String,
      telefono: String,
      direccion: String,
      distrito: String,
      referencia: { type: String, default: "" },
    },
    pago: {
      stripeSessionId: { type: String, index: true, sparse: true },
      referencia: String,
      fecha: Date,
    },
  },
  { timestamps: true },
);

export const Pedido = (models.Pedido as Model<IPedido>) || model<IPedido>("Pedido", pedidoSchema);
