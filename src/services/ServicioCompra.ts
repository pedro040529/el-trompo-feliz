import { isValidObjectId } from "mongoose";
import { conectarDB } from "@/lib/mongodb";
import { ErrorApp } from "@/lib/errores";
import type { DatosEntrega } from "@/lib/tipos";
import { Pedido } from "@/models/Pedido";
import { Juguete } from "@/models/Juguete";
import { Carrito } from "@/models/Carrito";
import { ServicioCarrito } from "./ServicioCarrito";

function numeroPedido() {
  const f = new Date();
  const fecha = `${f.getFullYear()}${String(f.getMonth() + 1).padStart(2, "0")}${String(f.getDate()).padStart(2, "0")}`;
  return `TF-${fecha}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export const ServicioCompra = {
  /**
   * Valida el carrito (stock vigente) y genera el pedido en estado PENDIENTE
   * con una copia de los precios y nombres del momento de la compra.
   */
  async iniciarCompra(clienteId: string, datos: DatosEntrega) {
    await conectarDB();
    const carrito = await ServicioCarrito.obtener(clienteId);
    if (carrito.items.length === 0) throw new ErrorApp("Tu carrito está vacío", 400);
    const sinStock = carrito.items.filter((i) => !i.disponible);
    if (sinStock.length > 0) {
      const lista = sinStock.map((i) => `${i.nombre} (quedan ${i.stock})`).join(", ");
      throw new ErrorApp(`Ajusta tu carrito, no hay stock suficiente de: ${lista}`, 409);
    }
    const pedido = await Pedido.create({
      numero: numeroPedido(),
      cliente: clienteId,
      items: carrito.items.map((i) => ({
        juguete: i.jugueteId,
        nombre: i.nombre,
        precioUnitario: i.precioUnitario,
        cantidad: i.cantidad,
      })),
      total: carrito.total,
      estado: "PENDIENTE",
      datosEntrega: datos,
    });
    return { id: String(pedido._id), numero: pedido.numero, total: pedido.total };
  },

  /**
   * Marca el pedido como PAGADO, descuenta el stock de forma atómica y vacía el carrito.
   * Es idempotente: si el pedido ya no está pendiente, no hace nada.
   */
  async confirmarPago(pedidoId: string, referencia?: string) {
    await conectarDB();
    const pedido = isValidObjectId(pedidoId) ? await Pedido.findById(pedidoId) : null;
    if (!pedido) throw new ErrorApp("Pedido no encontrado", 404);
    if (pedido.estado !== "PENDIENTE") return;

    const descontados: { id: string; cantidad: number }[] = [];
    for (const it of pedido.items) {
      const r = await Juguete.updateOne({ _id: it.juguete, stock: { $gte: it.cantidad } }, { $inc: { stock: -it.cantidad } });
      if (r.modifiedCount !== 1) {
        for (const d of descontados) await Juguete.updateOne({ _id: d.id }, { $inc: { stock: d.cantidad } });
        throw new ErrorApp(`Ya no hay stock suficiente de "${it.nombre}"`, 409);
      }
      descontados.push({ id: String(it.juguete), cantidad: it.cantidad });
    }
    pedido.estado = "PAGADO";
    pedido.set("pago.referencia", referencia);
    pedido.set("pago.fecha", new Date());
    await pedido.save();
    await Carrito.updateOne({ cliente: pedido.cliente }, { $set: { items: [] } });
  },
};
