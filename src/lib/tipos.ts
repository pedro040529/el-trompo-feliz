import type { EstadoPedido } from "./constantes";

export type Rol = "CLIENTE" | "ADMIN";

export interface CategoriaDTO {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface JugueteDTO {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  edadMinima: number;
  edadMaxima: number;
  stock: number;
  categoria: { id: string; nombre: string } | null;
}

export interface ItemCarritoDTO {
  jugueteId: string;
  nombre: string;
  imagenUrl: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
  stock: number;
  disponible: boolean;
}

export interface CarritoDTO {
  items: ItemCarritoDTO[];
  total: number;
  cantidadTotal: number;
  hayProblemas: boolean;
}

export interface DatosEntrega {
  nombre: string;
  telefono: string;
  direccion: string;
  distrito: string;
  referencia: string;
}

export interface ItemPedidoDTO {
  jugueteId: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface PedidoDTO {
  id: string;
  numero: string;
  fecha: string;
  estado: EstadoPedido;
  total: number;
  items: ItemPedidoDTO[];
  datosEntrega: DatosEntrega;
  cliente?: { id: string; nombre: string; correo: string } | null;
}
