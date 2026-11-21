/**
 * Carga datos iniciales: categorías, juguetes de ejemplo y el usuario administrador.
 * Uso: npm run seed   (requiere MONGODB_URI y ADMIN_EMAIL / ADMIN_PASSWORD en .env.local)
 */
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { Categoria } from "../src/models/Categoria";
import { Juguete } from "../src/models/Juguete";
import { Usuario } from "../src/models/Usuario";

const categorias = [
  { nombre: "Muñecas y peluches", descripcion: "Compañeros suaves para abrazar" },
  { nombre: "Construcción", descripcion: "Bloques y sets para armar" },
  { nombre: "Juegos de mesa", descripcion: "Diversión para toda la familia" },
  { nombre: "Vehículos", descripcion: "Autos, trenes y más" },
  { nombre: "Educativos", descripcion: "Aprender jugando" },
  { nombre: "Aire libre", descripcion: "Para jugar afuera" },
];

const juguetes: [string, string, number, number, number, number, string][] = [
  // nombre, descripción, precio, edadMin, edadMax, stock, categoría
  ["Osito de peluche gigante", "Osito suave de 60 cm, ideal para abrazar a la hora de dormir.", 89.9, 0, 99, 12, "Muñecas y peluches"],
  ["Muñeca Lucía con accesorios", "Muñeca de 35 cm con vestido, zapatos y cepillo.", 59.9, 3, 8, 8, "Muñecas y peluches"],
  ["Bloques de colores x100", "100 bloques encajables de colores, libres de BPA.", 69.9, 3, 8, 15, "Construcción"],
  ["Set de construcción Ciudad", "Arma tu propia ciudad con 450 piezas compatibles.", 149.9, 7, 14, 6, "Construcción"],
  ["Ajedrez de madera", "Tablero plegable y piezas de madera tallada.", 79.9, 6, 99, 10, "Juegos de mesa"],
  ["Juego de cartas Aventuras", "Juego de cartas para 2 a 6 jugadores.", 34.9, 6, 99, 20, "Juegos de mesa"],
  ["Rompecabezas 100 piezas Selva", "Rompecabezas ilustrado con animales de la selva.", 29.9, 4, 8, 3, "Juegos de mesa"],
  ["Auto de carreras a control remoto", "Auto veloz con batería recargable y 30 m de alcance.", 119.9, 6, 12, 7, "Vehículos"],
  ["Tren de madera con vías", "Set de 40 piezas con locomotora y vagones.", 99.9, 3, 7, 0, "Vehículos"],
  ["Xilófono musical de 8 notas", "Xilófono colorido con baquetas, desarrolla el oído musical.", 44.9, 2, 6, 14, "Educativos"],
  ["Kit de ciencia Volcán", "Experimentos seguros para pequeños científicos.", 54.9, 8, 12, 9, "Educativos"],
  ["Pelota de fútbol N°4", "Pelota resistente para cancha y parque.", 39.9, 6, 12, 25, "Aire libre"],
  ["Cometa arcoíris", "Cometa de tela con cola de colores y carrete.", 24.9, 5, 99, 4, "Aire libre"],
];

async function main() {
  const uri = process.env.MONGODB_URI;
  const correo = (process.env.ADMIN_EMAIL ?? "admin@trompofeliz.pe").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!uri) throw new Error("Falta MONGODB_URI en .env.local");
  if (!password || password.length < 8) throw new Error("Define ADMIN_PASSWORD (mínimo 8 caracteres) en .env.local");

  await mongoose.connect(uri);

  const mapaCat = new Map<string, mongoose.Types.ObjectId>();
  for (const c of categorias) {
    const doc = await Categoria.findOneAndUpdate({ nombre: c.nombre }, c, { upsert: true, new: true });
    mapaCat.set(c.nombre, doc._id);
  }

  let nuevos = 0;
  for (const [nombre, descripcion, precio, edadMinima, edadMaxima, stock, cat] of juguetes) {
    const existe = await Juguete.exists({ nombre });
    if (!existe) {
      await Juguete.create({ nombre, descripcion, precio, edadMinima, edadMaxima, stock, categoria: mapaCat.get(cat) });
      nuevos++;
    }
  }

  const admin = await Usuario.findOne({ correo });
  if (!admin) {
    await Usuario.create({ nombre: "Administrador", correo, passwordHash: await bcrypt.hash(password, 10), rol: "ADMIN" });
    console.log(`Administrador creado: ${correo}`);
  } else {
    console.log(`El administrador ${correo} ya existe (no se modificó).`);
  }
  console.log(`Listo: ${categorias.length} categorías, ${nuevos} juguetes nuevos.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
