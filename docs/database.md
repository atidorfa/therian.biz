# Base de Datos

## Proveedor

| Entorno | Motor | Driver |
|---------|-------|--------|
| Producción | PostgreSQL | `@prisma/client` (binary engine) |
| Desarrollo | PostgreSQL local o cualquier URL en `.env` | mismo |

El `provider` en `prisma/schema.prisma` es `postgresql`. Se soportan dos URLs: `DATABASE_URL` (pooled, para consultas) y `DIRECT_URL` (directo, para migraciones).

---

## Modelos

### User

```prisma
model User {
  id                 String              @id @default(uuid())
  email              String              @unique
  password           String              // bcrypt hash
  name               String?
  emailVerified      DateTime?           // null = pendiente de verificación
  createdAt          DateTime            @default(now())
  gold               Int                 @default(0)
  essence            Int                 @default(0)
  therianSlots       Int                 @default(1)
  therians           Therian[]
  verificationTokens VerificationToken[]
  inventoryItems     InventoryItem[]
}
```

**Notas:**
- `emailVerified` — login bloqueado si es `null`; se establece por el endpoint de verificación
- `gold` / `essence` — divisas del juego; `gold` se gana con acciones, `essence` se compra
- `therianSlots` — límite de Therians activos; por defecto 1, ampliable con `slot_extra` en la tienda

---

### VerificationToken

```prisma
model VerificationToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

Tokens de un solo uso enviados por email. Se eliminan al verificar la cuenta.

---

### Therian

```prisma
model Therian {
  id                String        @id @default(uuid())
  userId            String
  user              User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  speciesId         String        // ID de catálogo: wolf | fox | cat | crow | deer | bear
  rarity            String        // COMMON | UNCOMMON | RARE | EPIC | LEGENDARY | MYTHIC
  seed              String        // HMAC-SHA256 para reproducibilidad
  appearance        String @db.Text  // JSON: TherianAppearance
  stats             String @db.Text  // JSON: TherianStats
  traitId           String        // ID de catálogo: silent | impulsive | ...
  level             Int           @default(1)
  xp                Int           @default(0)
  lastActionAt      DateTime?
  actionsUsed       Int           @default(0)
  actionGains       String        @default("{}") @db.Text  // JSON: Record<stat, total_ganado>
  createdAt         DateTime      @default(now())
  equippedRunes     String        @default("[]") @db.Text  // JSON: runeId[]
  name              String?       @unique   // nombre personalizable (opcional)
  bites             Int           @default(0)
  lastBiteAt        DateTime?
  accessories       String        @default("[]") @db.Text  // JSON: Record<slot, accessoryId>
  status            String        @default("active")       // "active" | "capsule"
  equippedAbilities String        @default("[]") @db.Text  // JSON: abilityId[] (max 4)
  auraId            String?       // ID del catálogo lib/catalogs/auras.ts (asignado en generación)

  actionLogs          ActionLog[]
  battlesAsChallenger BattleLog[] @relation("Challenger")
  battlesAsTarget     BattleLog[] @relation("Target")
  runeInventory       RuneInventory[]
}
```

**Columnas JSON (deserialización en `lib/therian-dto.ts`):**

| Campo | Tipo en runtime | Descripción |
|-------|----------------|-------------|
| `appearance` | `TherianAppearance` | `{ palette, eyes, pattern, signature }` |
| `stats` | `TherianStats` | `{ vitality, agility, instinct, charisma }` (valores base, sin runas) |
| `equippedRunes` | `string[]` | IDs de runas del catálogo (max 4 recomendado) |
| `accessories` | `Record<slot, id>` o `string[]` legacy | Accesorios por slot (migración automática de formato antiguo) |
| `equippedAbilities` | `string[]` | IDs de habilidades PvP (max 4) |
| `actionGains` | `Record<string, number>` | Historial de ganancias por acción |

**`auraId` (campo escalar, no JSON):**
ID de cadena que referencia una entrada del catálogo `lib/catalogs/auras.ts`. Se asigna una vez al generar el Therian y no cambia. `null` en Therians generados antes de la migración `20260226000000`; el sistema aplica un aura legacy por defecto en ese caso.

**Status:**
- `active` — Therian normal, accesible
- `capsule` — almacenado en cápsula (no activo en PvP ni acciones)

---

### RuneInventory

```prisma
model RuneInventory {
  id         String   @id @default(uuid())
  therianId  String
  therian    Therian  @relation(fields: [therianId], references: [id], onDelete: Cascade)
  runeId     String
  quantity   Int      @default(1)
  source     String   @default("unknown")  // "action" | "shop" | "battle" | "gift"
  obtainedAt DateTime @default(now())

  @@unique([therianId, runeId])
  @@index([therianId])
}
```

Inventario de runas por Therian. Una entrada por combinación `(therianId, runeId)` con `quantity`.

---

### BattleLog

```prisma
model BattleLog {
  id           String   @id @default(uuid())
  challengerId String
  challenger   Therian  @relation("Challenger", fields: [challengerId], references: [id], onDelete: Cascade)
  targetId     String
  target       Therian  @relation("Target", fields: [targetId], references: [id], onDelete: Cascade)
  winnerId     String   // therianId del ganador
  rounds       String   @db.Text  // JSON: historial de rondas (sistema 1v1 legacy)
  createdAt    DateTime @default(now())
}
```

Combates 1v1 del sistema legacy. El nuevo sistema 3v3 usa `PvpBattle`.

---

### ActionLog

```prisma
model ActionLog {
  id         String   @id @default(uuid())
  therianId  String
  therian    Therian  @relation(fields: [therianId], references: [id], onDelete: Cascade)
  actionType String   // CARE | TRAIN | EXPLORE | SOCIAL
  delta      String   @db.Text  // JSON: cambios aplicados a stats/xp
  narrative  String   @db.Text  // Texto narrativo generado
  createdAt  DateTime @default(now())
}
```

Historial de acciones diarias.

---

### PvpBattle

```prisma
model PvpBattle {
  id           String   @id @default(uuid())
  attackerId   String   // userId del jugador
  attackerTeam String   @db.Text  // JSON: therianId[] (3 IDs)
  defenderTeam String   @db.Text  // JSON: therianId[] (3 IDs, oponente aleatorio)
  state        String   @db.Text  // JSON: BattleState completo
  status       String   @default("active")  // "active" | "completed"
  winnerId     String?  // userId del ganador; null = ganó el defensor
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

**`state`** almacena el `BattleState` completo serializado como JSON. Ver `lib/pvp/types.ts` para el tipo.

---

### InventoryItem

```prisma
model InventoryItem {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String   // EGG | ACCESSORY | UPGRADE
  itemId    String   // egg_common | egg_uncommon | acc_crown | slot_extra | ...
  quantity  Int      @default(1)
  createdAt DateTime @default(now())

  @@unique([userId, itemId])
}
```

Inventario del usuario (no ligado a un Therian concreto). Los huevos se usan en fusión para sustituir un slot.

---

## Relaciones

```
User ─────── Therian[] (1:N)
User ─────── VerificationToken[] (1:N)
User ─────── InventoryItem[] (1:N)
Therian ──── ActionLog[] (1:N)
Therian ──── RuneInventory[] (1:N)
Therian ──── BattleLog[] x2 (Challenger / Target)
```

---

## Migraciones

Las migraciones viven en `prisma/migrations/`. Convención de nombres:

```
prisma/migrations/
├── 20241201000000_init/
├── 20250110000000_add_action_log/
├── 20260215000000_pvp_system/
├── 20260224000000_therian_capsule/
└── 20260226000000_therian_aura_id/   ← auraId String? en Therian
```

Para aplicar migraciones en desarrollo:

```bash
npx prisma migrate dev --name <nombre_descriptivo>
```

Para producción (sin generar migración nueva):

```bash
npx prisma migrate deploy
```

---

## Singleton PrismaClient

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

Siempre importar `db` desde `@/lib/db`. Nunca instanciar `PrismaClient` directamente.
