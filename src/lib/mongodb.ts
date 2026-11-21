import mongoose from "mongoose";
// Registra todos los modelos: en serverless cada ruta arranca por separado y populate() los necesita.
import "@/models/Usuario";
import "@/models/Categoria";
import "@/models/Juguete";
import "@/models/Carrito";
import "@/models/Pedido";

type Cache = { conn?: typeof mongoose; promise?: Promise<typeof mongoose> };
const globalCache = globalThis as unknown as { _mongoose?: Cache };
const cache: Cache = (globalCache._mongoose ??= {});

export async function conectarDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Falta MONGODB_URI en .env.local");
  if (cache.conn) return cache.conn;
  cache.promise ??= mongoose.connect(uri, { bufferCommands: false });
  try {
    cache.conn = await cache.promise;
  } catch (e) {
    cache.promise = undefined;
    throw e;
  }
  return cache.conn;
}
