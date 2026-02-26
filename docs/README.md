# therian.biz — Documentación

Therian.biz es un juego de colección de criaturas procedurales con combate PvP 3v3, sistema de fusión, tienda de cosméticos y clasificaciones.

## Índice

| Documento | Contenido |
|-----------|-----------|
| [architecture.md](./architecture.md) | Stack, estructura de carpetas, patrones de código |
| [database.md](./database.md) | Modelos Prisma, relaciones, migraciones |
| [api.md](./api.md) | Todos los endpoints REST con contratos completos |
| [generation.md](./generation.md) | Motor de generación procedural de Therians |
| [pvp.md](./pvp.md) | Sistema de combate PvP 3v3 — engine, habilidades, IA |
| [items-shop.md](./items-shop.md) | Tienda, huevos, accesorios, runas, fusión |
| [auth.md](./auth.md) | Autenticación, sesiones, flujo de registro |
| [frontend.md](./frontend.md) | Componentes, animaciones WAAPI, patrones UI |

---

## Resumen del sistema

```
Usuario registrado
       │
       ▼
  Adopta Therian (generación procedural por seed)
       │
       ├── Acciones diarias (stats + XP + gold)
       │
       ├── Tienda → comprar huevos / accesorios / runas / slots
       │
       ├── Fusión → combinar 3 Therians/huevos → rareza superior
       │
       ├── PvP 3v3 → seleccionar equipo → batalla automática
       │
       └── Cápsula → almacenar Therians inactivos
```

## Variables de entorno requeridas

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
SERVER_SECRET="..."          # HMAC para seeds de generación
APP_BASE_URL="http://localhost:3000"
```

## Comandos principales

```bash
npm run dev          # Servidor de desarrollo
npm run build        # prisma generate + next build
npx prisma migrate dev --name <nombre>   # Nueva migración
npx prisma studio    # UI de base de datos
```
