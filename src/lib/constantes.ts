export const ESTADOS = ["PENDIENTE", "PAGADO", "ENVIADO", "ENTREGADO"] as const;
export type EstadoPedido = (typeof ESTADOS)[number];

export const ETIQUETA_ESTADO: Record<EstadoPedido, string> = {
  PENDIENTE: "Pendiente",
  PAGADO: "Pagado",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
};

export const RANGOS_EDAD = [
  { id: "0-2", min: 0, max: 2, etiqueta: "0 a 2 años" },
  { id: "3-5", min: 3, max: 5, etiqueta: "3 a 5 años" },
  { id: "6-8", min: 6, max: 8, etiqueta: "6 a 8 años" },
  { id: "9-12", min: 9, max: 12, etiqueta: "9 a 12 años" },
  { id: "13+", min: 13, max: 99, etiqueta: "13 años o más" },
] as const;

export const STOCK_BAJO = 5;
export const POR_PAGINA = 12;

export function formatoPrecio(n: number) {
  return `S/ ${n.toFixed(2)}`;
}

export function textoEdad(min: number, max: number) {
  if (max >= 99) return `${min}+ años`;
  if (min === max) return `${min} años`;
  return `${min} a ${max} años`;
}
