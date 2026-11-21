import { z } from "zod";
import { ESTADOS } from "./constantes";

const texto = (min = 1, max = 200) => z.string().trim().min(min, "Campo obligatorio").max(max);

export const registroSchema = z.object({
  nombre: texto(2, 80),
  correo: z.string().trim().toLowerCase().email("Correo no válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(100),
  telefono: z.string().trim().max(20).optional().default(""),
});

export const loginSchema = z.object({
  correo: z.string().trim().toLowerCase().email("Correo no válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export const recuperarSchema = z.object({
  correo: z.string().trim().toLowerCase().email("Correo no válido"),
});

export const nuevaPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(100),
});

export const jugueteSchema = z
  .object({
    nombre: texto(2, 120),
    descripcion: texto(1, 2000),
    precio: z.coerce.number().positive("El precio debe ser mayor a 0").max(100000),
    imagenUrl: z.string().trim().max(500).optional().default(""),
    edadMinima: z.coerce.number().int().min(0).max(99),
    edadMaxima: z.coerce.number().int().min(0).max(99),
    stock: z.coerce.number().int().min(0, "El stock no puede ser negativo").max(100000),
    categoria: z.string().min(1, "Elige una categoría"),
  })
  .refine((v) => v.edadMaxima >= v.edadMinima, {
    message: "La edad máxima no puede ser menor que la mínima",
    path: ["edadMaxima"],
  });

export const stockSchema = z.object({
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo").max(100000),
});

export const categoriaSchema = z.object({
  nombre: texto(2, 60),
  descripcion: z.string().trim().max(300).optional().default(""),
});

export const agregarSchema = z.object({
  jugueteId: z.string().min(1),
  cantidad: z.coerce.number().int().min(1).max(99).default(1),
});

export const cantidadSchema = z.object({
  cantidad: z.coerce.number().int().min(1, "La cantidad mínima es 1").max(99),
});

export const entregaSchema = z.object({
  nombre: texto(2, 80),
  telefono: texto(6, 20),
  direccion: texto(5, 200),
  distrito: texto(2, 80),
  referencia: z.string().trim().max(200).optional().default(""),
});

export const estadoSchema = z.object({ estado: z.enum(ESTADOS) });
