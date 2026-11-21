import { isValidObjectId, Types, type QueryFilter } from "mongoose";
import { conectarDB } from "@/lib/mongodb";
import { ErrorApp } from "@/lib/errores";
import { POR_PAGINA, RANGOS_EDAD, STOCK_BAJO } from "@/lib/constantes";
import type { CategoriaDTO, JugueteDTO } from "@/lib/tipos";
import { Juguete, type IJuguete } from "@/models/Juguete";
import { Categoria } from "@/models/Categoria";
import { Carrito } from "@/models/Carrito";

export interface FiltroCatalogo {
  q?: string;
  categoria?: string;
  edad?: string;
  precioMin?: number;
  precioMax?: number;
  orden?: "recientes" | "precio-asc" | "precio-desc" | "nombre";
  pagina?: number;
  soloConStock?: boolean;
}

type JugueteLean = IJuguete & { _id: Types.ObjectId; categoria: { _id: Types.ObjectId; nombre: string } | null };

function aDTO(j: JugueteLean): JugueteDTO {
  return {
    id: String(j._id),
    nombre: j.nombre,
    descripcion: j.descripcion,
    precio: j.precio,
    imagenUrl: j.imagenUrl ?? "",
    edadMinima: j.edadMinima,
    edadMaxima: j.edadMaxima,
    stock: j.stock,
    categoria: j.categoria ? { id: String(j.categoria._id), nombre: j.categoria.nombre } : null,
  };
}

function aCategoriaDTO(c: { _id: Types.ObjectId; nombre: string; descripcion?: string }): CategoriaDTO {
  return { id: String(c._id), nombre: c.nombre, descripcion: c.descripcion ?? "" };
}

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function validarCategoria(id: string) {
  if (!isValidObjectId(id) || !(await Categoria.exists({ _id: id }))) {
    throw new ErrorApp("La categoría elegida no existe", 400);
  }
}

export const ServicioCatalogo = {
  async listar(f: FiltroCatalogo = {}) {
    await conectarDB();
    const filtro: QueryFilter<IJuguete> = {};
    if (f.q?.trim()) {
      const rx = new RegExp(escapar(f.q.trim()), "i");
      filtro.$or = [{ nombre: rx }, { descripcion: rx }];
    }
    if (f.categoria && isValidObjectId(f.categoria)) filtro.categoria = f.categoria;
    const rango = RANGOS_EDAD.find((r) => r.id === f.edad);
    if (rango) {
      filtro.edadMinima = { $lte: rango.max };
      filtro.edadMaxima = { $gte: rango.min };
    }
    if (f.precioMin !== undefined || f.precioMax !== undefined) {
      filtro.precio = {};
      if (f.precioMin !== undefined) filtro.precio.$gte = f.precioMin;
      if (f.precioMax !== undefined) filtro.precio.$lte = f.precioMax;
    }
    if (f.soloConStock) filtro.stock = { $gt: 0 };

    const orden: Record<string, 1 | -1> =
      f.orden === "precio-asc" ? { precio: 1 } : f.orden === "precio-desc" ? { precio: -1 } : f.orden === "nombre" ? { nombre: 1 } : { createdAt: -1 };
    const pagina = Math.max(1, f.pagina ?? 1);

    const [docs, total] = await Promise.all([
      Juguete.find(filtro).sort(orden).skip((pagina - 1) * POR_PAGINA).limit(POR_PAGINA).populate("categoria", "nombre").lean(),
      Juguete.countDocuments(filtro),
    ]);
    return {
      items: (docs as unknown as JugueteLean[]).map(aDTO),
      total,
      pagina,
      paginas: Math.max(1, Math.ceil(total / POR_PAGINA)),
    };
  },

  async obtener(id: string): Promise<JugueteDTO> {
    await conectarDB();
    if (!isValidObjectId(id)) throw new ErrorApp("Juguete no encontrado", 404);
    const j = await Juguete.findById(id).populate("categoria", "nombre").lean();
    if (!j) throw new ErrorApp("Juguete no encontrado", 404);
    return aDTO(j as unknown as JugueteLean);
  },

  async listarCategorias(): Promise<CategoriaDTO[]> {
    await conectarDB();
    const cats = await Categoria.find().sort({ nombre: 1 }).lean();
    return cats.map(aCategoriaDTO);
  },

  // ---------- administración ----------
  async crearJuguete(datos: Omit<IJuguete, "categoria"> & { categoria: string }) {
    await conectarDB();
    await validarCategoria(datos.categoria);
    const j = await Juguete.create(datos);
    return this.obtener(String(j._id));
  },

  async actualizarJuguete(id: string, datos: Omit<IJuguete, "categoria"> & { categoria: string }) {
    await conectarDB();
    await validarCategoria(datos.categoria);
    const j = isValidObjectId(id) ? await Juguete.findByIdAndUpdate(id, datos, { new: true }) : null;
    if (!j) throw new ErrorApp("Juguete no encontrado", 404);
    return this.obtener(id);
  },

  async eliminarJuguete(id: string) {
    await conectarDB();
    const j = isValidObjectId(id) ? await Juguete.findByIdAndDelete(id) : null;
    if (!j) throw new ErrorApp("Juguete no encontrado", 404);
    await Carrito.updateMany({}, { $pull: { items: { juguete: j._id } } });
  },

  async actualizarStock(id: string, stock: number) {
    await conectarDB();
    const j = isValidObjectId(id) ? await Juguete.findByIdAndUpdate(id, { stock }, { new: true }) : null;
    if (!j) throw new ErrorApp("Juguete no encontrado", 404);
    return this.obtener(id);
  },

  async crearCategoria(datos: { nombre: string; descripcion: string }) {
    await conectarDB();
    if (await Categoria.exists({ nombre: new RegExp(`^${escapar(datos.nombre)}$`, "i") })) {
      throw new ErrorApp("Ya existe una categoría con ese nombre", 409);
    }
    return aCategoriaDTO((await Categoria.create(datos)).toObject());
  },

  async actualizarCategoria(id: string, datos: { nombre: string; descripcion: string }) {
    await conectarDB();
    if (!isValidObjectId(id)) throw new ErrorApp("Categoría no encontrada", 404);
    const dup = await Categoria.exists({ nombre: new RegExp(`^${escapar(datos.nombre)}$`, "i"), _id: { $ne: id } });
    if (dup) throw new ErrorApp("Ya existe una categoría con ese nombre", 409);
    const c = await Categoria.findByIdAndUpdate(id, datos, { new: true }).lean();
    if (!c) throw new ErrorApp("Categoría no encontrada", 404);
    return aCategoriaDTO(c);
  },

  async eliminarCategoria(id: string) {
    await conectarDB();
    if (!isValidObjectId(id)) throw new ErrorApp("Categoría no encontrada", 404);
    if (await Juguete.exists({ categoria: id })) {
      throw new ErrorApp("No se puede eliminar: hay juguetes en esta categoría", 409);
    }
    const c = await Categoria.findByIdAndDelete(id);
    if (!c) throw new ErrorApp("Categoría no encontrada", 404);
  },

  async listarAdmin(q?: string): Promise<JugueteDTO[]> {
    await conectarDB();
    const filtro: QueryFilter<IJuguete> = q?.trim() ? { nombre: new RegExp(escapar(q.trim()), "i") } : {};
    const docs = await Juguete.find(filtro).sort({ nombre: 1 }).populate("categoria", "nombre").lean();
    return (docs as unknown as JugueteLean[]).map(aDTO);
  },

  async stockBajo(): Promise<JugueteDTO[]> {
    await conectarDB();
    const docs = await Juguete.find({ stock: { $lte: STOCK_BAJO } }).sort({ stock: 1 }).limit(20).populate("categoria", "nombre").lean();
    return (docs as unknown as JugueteLean[]).map(aDTO);
  },
};
