# Arquitectura

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript strict |
| Estilos | Tailwind CSS v4 (`@import "tailwindcss"`) |
| Animaciones | WAAPI (`element.animate()`), Framer Motion (componentes legacy) |
| Auth | NextAuth.js v4 — CredentialsProvider + JWT |
| ORM | Prisma v5 |
| Base de datos | PostgreSQL (dev: SQLite vía `file:./dev.db`) |
| Validación | Zod |
| RNG | `seedrandom` + HMAC-SHA256 para seeds |
| Email | Nodemailer / Resend |

---

## Estructura de carpetas

```
therian.biz/
│
├── app/                        # Next.js App Router
│   ├── (game)/layout.tsx       # Layout compartido de páginas de juego
│   ├── api/                    # API Routes (backend)
│   │   ├── auth/               # NextAuth + registro + verificación
│   │   ├── me/                 # Sesión actual
│   │   ├── therian/            # CRUD + acciones de un Therian
│   │   ├── therians/           # Colección del usuario
│   │   ├── pvp/                # Sistema de combate 3v3
│   │   ├── shop/               # Tienda
│   │   ├── inventory/          # Inventario del usuario
│   │   ├── wallet/             # Divisas
│   │   └── leaderboard/        # Rankings
│   ├── login/                  # Página de login
│   ├── adopt/                  # Página de adopción
│   ├── therian/                # Perfil principal del Therian
│   ├── pvp/                    # Arena PvP
│   ├── leaderboard/            # Tabla de clasificación
│   ├── casa/                   # Almacén de cápsulas
│   ├── user/[id]/              # Perfil público
│   ├── layout.tsx              # Root layout (SessionProvider, fuentes)
│   ├── page.tsx                # Redirect a /login o /therian
│   └── globals.css             # Tokens CSS + keyframes de animación
│
├── components/                 # Componentes React (Client Components)
│   ├── TherianCard.tsx         # Card principal (76KB — tab stats/habilidades/cosméticos)
│   ├── TherianAvatar.tsx       # Router: elige SVG simple o Chibi por nivel
│   ├── TherianAvatarSVG.tsx    # Avatar blob nivel 1-2
│   ├── TherianAvatarChibi.tsx  # Avatar egg-head animado nivel 3+
│   ├── pvp/
│   │   ├── BattleField.tsx     # Arena animada (WAAPI cross-battlefield)
│   │   ├── PvpRoom.tsx         # Orquestador: setup → battle → result
│   │   └── TeamSetup.tsx       # Selección de equipo de 3
│   ├── ShopModal.tsx           # Modal de tienda
│   ├── FusionModal.tsx         # Modal de fusión
│   ├── RuneSystem.tsx          # Interfaz de runas
│   └── ...                     # Componentes de navegación y UI menores
│
├── lib/                        # Lógica de negocio pura
│   ├── auth.ts                 # Config NextAuth
│   ├── session.ts              # Helper getSession()
│   ├── db.ts                   # Singleton PrismaClient
│   ├── therian-dto.ts          # Transformación DB → DTO enriquecido
│   ├── generation/             # Generación procedural
│   ├── pvp/                    # Motor de combate 3v3
│   ├── battle/                 # Motor de combate 1v1 (legacy)
│   ├── actions/                # Acciones diarias
│   ├── catalogs/               # Catálogos de contenido
│   ├── items/                  # Huevos y accesorios
│   └── shop/                   # Catálogo de tienda
│
├── prisma/
│   ├── schema.prisma           # Modelos de datos
│   └── migrations/             # Migraciones versionadas
│
└── docs/                       # Esta documentación
```

---

## Patrones de código

### API Routes
Todas las rutas siguen el mismo patrón:

```typescript
export async function POST(req: NextRequest) {
  // 1. Auth check
  const session = await getSession()
  if (!session?.user?.id) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  // 2. Input validation (Zod)
  let body
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 }) }

  // 3. Business logic (lib/)
  const result = await doSomething(body)

  // 4. Response
  return NextResponse.json(result, { status: 200 })
}
```

### Errores estándar

| Código | HTTP | Significado |
|--------|------|-------------|
| `UNAUTHORIZED` | 401 | Sin sesión |
| `INVALID_INPUT` | 400 | Zod falló |
| `NOT_FOUND` | 404 | Recurso no existe |
| `CONFLICT` | 409 | Estado inválido (ej: batalla activa) |
| `COOLDOWN_ACTIVE` | 429 | Acción en cooldown |
| `ENGINE_ERROR` | 500 | Error en motor de juego |

### TherianDTO
El DTO se genera en `lib/therian-dto.ts` y es la representación estándar de un Therian para el frontend. Incluye:
- Stats base + bonificaciones de runas aplicadas
- Cooldowns calculados en runtime (24h desde `lastActionAt`)
- Objetos de catálogo enriquecidos (species, trait, palette)
- Lista de accesorios con migración de formato legacy

```typescript
export type TherianDTO = ReturnType<typeof toTherianDTO>
```

### Diseño visual
Variables CSS en `globals.css`:

```css
--bg-primary:    #08080F  /* fondo principal */
--bg-secondary:  #0F0F1A  /* fondo cards */
--accent-purple: #9B59B6  /* acento principal */
--accent-ember:  #E67E22  /* acento secundario */
--rarity-common:    #9CA3AF
--rarity-rare:      #60A5FA
--rarity-epic:      #C084FC
--rarity-legendary: #FCD34D
```

Clases de utilidad custom: `.glow-{rarity}`, `.text-glow-{rarity}`, `.gradient-text`, `.result-reveal`, `.icon-pop`
