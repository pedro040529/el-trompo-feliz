# El Trompo Feliz — Tienda virtual de juguetes

Tienda en línea de la juguetería **El Trompo Feliz**, que hoy vende en tienda física y redes sociales. El sistema reemplaza los pedidos anotados a mano y el control de stock en hoja de cálculo, evitando ofrecer productos agotados.

## Funcionalidades
- **Catálogo:** listado de juguetes, búsqueda, filtros por categoría, edad y precio, y página de detalle.
- **Clientes:** registro, inicio y cierre de sesión.
- **Carrito:** agregar, quitar y cambiar cantidades, con subtotales, total y validación de stock.
- **Checkout:** datos de entrega, pago con Stripe (modo pruebas), generación del pedido y descuento de stock.
- **Pedidos:** historial y estado (Pendiente, Pagado, Enviado, Entregado).
- **Administración:** juguetes, categorías, stock y pedidos.

## Tecnologías
| Capa | Tecnología |
|---|---|
| Frontend / Backend | Next.js (App Router) + React + TypeScript |
| Estilos | Tailwind CSS |
| Base de datos | MongoDB Atlas + Mongoose |
| Pagos | Stripe (modo pruebas) |
| Despliegue | Vercel |
| Gestión | Scrum en Jira (proyecto TROMPO) |

## Requisitos previos
- Node.js 20 o superior y npm
- Cuenta de MongoDB Atlas (cluster gratuito)
- Cuenta de Stripe en modo pruebas

## Instalación
```bash
git clone https://github.com/pedro040529/el-trompo-feliz.git
cd el-trompo-feliz
npm install
cp .env.example .env.local   # completa las variables (ver abajo)
npm run seed                 # crea categorías, juguetes de ejemplo y el usuario administrador
```

### Variables de entorno (`.env.local`)
| Variable | Descripción |
|---|---|
| `MONGODB_URI` | Cadena de conexión de MongoDB Atlas (incluye el nombre de la base, p. ej. `/trompo`) |
| `AUTH_SECRET` | Secreto para firmar la sesión (mínimo 16 caracteres) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credenciales del administrador que crea `npm run seed` |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Claves de Stripe en modo pruebas (pago con tarjeta) |

## Ejecución
```bash
npm run dev      # desarrollo en http://localhost:3000
npm run build    # compilación de producción
npm start        # ejecutar la compilación
npm run lint     # revisión de código
npm run seed     # datos iniciales (categorías, juguetes y administrador)
```

## Estructura del repositorio
```
src/
  app/          páginas (App Router) y rutas API (app/api)
  components/   componentes React reutilizables
  services/     lógica de negocio (ServicioCatalogo, ServicioCarrito, ServicioCompra, ...)
  models/       modelos Mongoose (Juguete, Categoria, Usuario, Carrito, Pedido, ...)
  lib/          utilidades (conexión a MongoDB, autenticación, validaciones, constantes)
scripts/        seed.ts: datos iniciales
docs/
  diagramas/    modelo UML (StarUML) y capturas
  scrum/        evidencias de Scrum (backlog, sprints, burndown)
public/         archivos estáticos
```
La estructura sigue el modelo de diseño en `docs/diagramas`.

## Integrantes
| Nombre | Rol |
|---|---|
| Pedro Arnaldo Torres Chahua | Product Owner, Scrum Master y Desarrollador |

Curso TSIV — Universidad San Ignacio de Loyola (USIL).
