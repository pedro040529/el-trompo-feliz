import { isValidObjectId, Types } from "mongoose";
import { conectarDB } from "@/lib/mongodb";
import { ErrorApp } from "@/lib/errores";
import type { CarritoDTO } from "@/lib/tipos";
import { Carrito } from "@/models/Carrito";
import { Juguete } from "@/models/Juguete";

async function obtenerOCrear(clienteId: string) {
  const c = await Carrito.findOne({ cliente: clienteId });
  return c ?? (await Carrito.create({ cliente: clienteId, items: [] }));
}

async function armarDTO(clienteId: string): Promise<CarritoDTO> {
  const carrito = await Carrito.findOne({ cliente: clienteId }).lean();
  const ids = (carrito?.items ?? []).map((i) => i.juguete);
  const juguetes = await Juguete.find({ _id: { $in: ids } }).lean();
  const porId = new Map(juguetes.map((j) => [String(j._id), j]));
  const items = [];
  for (const it of carrito?.items ?? []) {
    const j = porId.get(String(it.juguete));
    if (!j) continue; // juguete eliminado del catálogo
    items.push({
      jugueteId: String(j._id),
      nombre: j.nombre,
      imagenUrl: j.imagenUrl ?? "",
      precioUnitario: j.precio,
      cantidad: it.cantidad,
      subtotal: Math.round(j.precio * it.cantidad * 100) / 100,
      stock: j.stock,
      disponible: j.stock >= it.cantidad,
    });
  }
  const total = Math.round(items.reduce((s, i) => s + i.subtotal, 0) * 100) / 100;
  return {
    items,
    total,
    cantidadTotal: items.reduce((s, i) => s + i.cantidad, 0),
    hayProblemas: items.some((i) => !i.disponible),
  };
}

async function buscarJuguete(id: string) {
  const j = isValidObjectId(id) ? await Juguete.findById(id) : null;
  if (!j) throw new ErrorApp("Juguete no encontrado", 404);
  return j;
}

export const ServicioCarrito = {
  async obtener(clienteId: string) {
    await conectarDB();
    return armarDTO(clienteId);
  },

  async cantidadItems(clienteId: string) {
    await conectarDB();
    const c = await Carrito.findOne({ cliente: clienteId }).lean();
    return (c?.items ?? []).reduce((s, i) => s + i.cantidad, 0);
  },

  async agregar(clienteId: string, jugueteId: string, cantidad: number) {
    await conectarDB();
    const j = await buscarJuguete(jugueteId);
    const carrito = await obtenerOCrear(clienteId);
    const existente = carrito.items.find((i) => String(i.juguete) === jugueteId);
    const nueva = (existente?.cantidad ?? 0) + cantidad;
    if (j.stock <= 0) throw new ErrorApp(`"${j.nombre}" está agotado`, 409);
    if (nueva > j.stock) {
      throw new ErrorApp(`Solo quedan ${j.stock} unidades de "${j.nombre}"` + (existente ? ` (ya tienes ${existente.cantidad} en tu carrito)` : ""), 409);
    }
    if (existente) existente.cantidad = nueva;
    else carrito.items.push({ juguete: new Types.ObjectId(jugueteId), cantidad });
    await carrito.save();
    return armarDTO(clienteId);
  },

  async cambiarCantidad(clienteId: string, jugueteId: string, cantidad: number) {
    await conectarDB();
    const j = await buscarJuguete(jugueteId);
    if (cantidad > j.stock) throw new ErrorApp(`Solo quedan ${j.stock} unidades de "${j.nombre}"`, 409);
    const carrito = await obtenerOCrear(clienteId);
    const item = carrito.items.find((i) => String(i.juguete) === jugueteId);
    if (!item) throw new ErrorApp("Ese juguete no está en tu carrito", 404);
    item.cantidad = cantidad;
    await carrito.save();
    return armarDTO(clienteId);
  },

  async quitar(clienteId: string, jugueteId: string) {
    await conectarDB();
    await Carrito.updateOne({ cliente: clienteId }, { $pull: { items: { juguete: jugueteId } } });
    return armarDTO(clienteId);
  },

  async vaciar(clienteId: string) {
    await conectarDB();
    await Carrito.updateOne({ cliente: clienteId }, { $set: { items: [] } });
  },
};
