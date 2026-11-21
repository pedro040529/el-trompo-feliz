import { isValidObjectId, Types, type QueryFilter } from "mongoose";
import { conectarDB } from "@/lib/mongodb";
import { ErrorApp } from "@/lib/errores";
import { ESTADOS, STOCK_BAJO, type EstadoPedido } from "@/lib/constantes";
import type { PedidoDTO } from "@/lib/tipos";
import { Pedido, type IPedido } from "@/models/Pedido";
import { Juguete } from "@/models/Juguete";
import { ServicioCompra } from "./ServicioCompra";

type PedidoLean = IPedido & { _id: Types.ObjectId; cliente: Types.ObjectId | { _id: Types.ObjectId; nombre: string; correo: string } };

export function pedidoADTO(p: PedidoLean): PedidoDTO {
  const cli = p.cliente as { _id?: Types.ObjectId; nombre?: string; correo?: string };
  return {
    id: String(p._id),
    numero: p.numero,
    fecha: new Date(p.createdAt).toISOString(),
    estado: p.estado,
    total: p.total,
    items: p.items.map((i) => ({
      jugueteId: String(i.juguete),
      nombre: i.nombre,
      precioUnitario: i.precioUnitario,
      cantidad: i.cantidad,
      subtotal: Math.round(i.precioUnitario * i.cantidad * 100) / 100,
    })),
    datosEntrega: {
      nombre: p.datosEntrega.nombre,
      telefono: p.datosEntrega.telefono,
      direccion: p.datosEntrega.direccion,
      distrito: p.datosEntrega.distrito,
      referencia: p.datosEntrega.referencia ?? "",
    },
    cliente: cli && cli.nombre ? { id: String(cli._id), nombre: cli.nombre, correo: cli.correo ?? "" } : null,
  };
}

export const ServicioPedidos = {
  async listarPorCliente(clienteId: string): Promise<PedidoDTO[]> {
    await conectarDB();
    const docs = await Pedido.find({ cliente: clienteId }).sort({ createdAt: -1 }).lean();
    return (docs as unknown as PedidoLean[]).map(pedidoADTO);
  },

  /** Si se indica clienteId, valida que el pedido le pertenezca. */
  async obtener(id: string, clienteId?: string): Promise<PedidoDTO> {
    await conectarDB();
    const p = isValidObjectId(id) ? await Pedido.findById(id).populate("cliente", "nombre correo").lean() : null;
    if (!p) throw new ErrorApp("Pedido no encontrado", 404);
    const dto = pedidoADTO(p as unknown as PedidoLean);
    if (clienteId && dto.cliente?.id !== clienteId) throw new ErrorApp("Pedido no encontrado", 404);
    return dto;
  },

  async listarTodos(estado?: string): Promise<PedidoDTO[]> {
    await conectarDB();
    const filtro: QueryFilter<IPedido> = {};
    if (estado && (ESTADOS as readonly string[]).includes(estado)) filtro.estado = estado as EstadoPedido;
    const docs = await Pedido.find(filtro).sort({ createdAt: -1 }).limit(200).populate("cliente", "nombre correo").lean();
    return (docs as unknown as PedidoLean[]).map(pedidoADTO);
  },

  /** Avanza el estado un paso: Pendiente → Pagado → Enviado → Entregado. */
  async cambiarEstado(id: string, nuevo: EstadoPedido): Promise<PedidoDTO> {
    await conectarDB();
    const p = isValidObjectId(id) ? await Pedido.findById(id) : null;
    if (!p) throw new ErrorApp("Pedido no encontrado", 404);
    const i = ESTADOS.indexOf(p.estado);
    const j = ESTADOS.indexOf(nuevo);
    if (j === i) return this.obtener(id);
    if (j !== i + 1) throw new ErrorApp(`No se puede pasar de ${p.estado} a ${nuevo}. El estado avanza un paso a la vez.`, 409);
    if (nuevo === "PAGADO") {
      await ServicioCompra.confirmarPago(id, "Pago confirmado por administración");
    } else {
      p.estado = nuevo;
      await p.save();
    }
    return this.obtener(id);
  },

  async resumenAdmin() {
    await conectarDB();
    const [porEstado, ventas, bajoStock] = await Promise.all([
      Pedido.aggregate([{ $group: { _id: "$estado", cantidad: { $sum: 1 } } }]),
      Pedido.aggregate([
        { $match: { estado: { $in: ["PAGADO", "ENVIADO", "ENTREGADO"] } } },
        { $group: { _id: null, total: { $sum: "$total" }, pedidos: { $sum: 1 } } },
      ]),
      Juguete.countDocuments({ stock: { $lte: STOCK_BAJO } }),
    ]);
    const cantidades = Object.fromEntries(ESTADOS.map((e) => [e, 0])) as Record<EstadoPedido, number>;
    for (const r of porEstado) cantidades[r._id as EstadoPedido] = r.cantidad;
    return {
      pedidosPorEstado: cantidades,
      ventasTotal: ventas[0]?.total ?? 0,
      pedidosPagados: ventas[0]?.pedidos ?? 0,
      juguetesBajoStock: bajoStock,
    };
  },
};
