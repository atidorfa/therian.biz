# Items, Tienda y Economía

---

## Divisas

| Moneda | Cómo se obtiene | Uso principal |
|--------|----------------|---------------|
| **Gold** | Acciones diarias (CARE/TRAIN/EXPLORE/SOCIAL) | Accesorios, servicios, huevos básicos |
| **Essence** | Compra con dinero real (futuro) / exchange | Artículos premium, huevos épicos, slots extra |

El balance se almacena en `User.gold` y `User.essence`. El endpoint `GET /api/wallet` devuelve ambos.

---

## Tienda (`lib/shop/catalog.ts`)

La tienda vende tres tipos de artículos:

| Tipo | Descripción |
|------|-------------|
| `cosmetic` | Accesorios visuales para el avatar del Therian |
| `service` | Acciones sobre el Therian (renombrar, etc.) |
| `slot` | Desbloqueo de slots adicionales de Therian |

### Catálogo completo

#### Servicios

| ID | Nombre | Gold | Essence |
|----|--------|------|---------|
| `rename` | Cambio de nombre | 500 | — |

#### Slots

| ID | Nombre | Gold | Essence |
|----|--------|------|---------|
| `slot_extra` | Slot Extra de Therian | — | 5 |

#### Accesorios Cosméticos

Los accesorios se organizan por **slot** (posición visual en el avatar):

##### Orejas (`orejas`)
| ID | Nombre | Gold |
|----|--------|------|
| `acc_ears_wolf` | Orejas de Lobo | 500 |
| `acc_ears_fox` | Orejas de Zorro | 500 |
| `acc_ears_cat` | Orejas de Gato | 500 |
| `acc_ears_crow` | Cresta de Cuervo | 500 |
| `acc_ears_deer` | Orejas de Ciervo | 500 |
| `acc_ears_bear` | Orejas de Oso | 500 |

##### Cola (`cola`)
| ID | Nombre | Gold |
|----|--------|------|
| `acc_tail_wolf` | Cola de Lobo | 600 |
| `acc_tail_fox` | Cola de Zorro | 700 |
| `acc_tail_cat` | Cola de Gato | 500 |
| `acc_tail_crow` | Plumas Caudales | 600 |
| `acc_tail_deer` | Cola de Ciervo | 400 |
| `acc_tail_bear` | Cola de Oso | 400 |

##### Ojos (`ojos`)
| ID | Nombre | Gold |
|----|--------|------|
| `acc_eyes_wolf` | Ojos de Lobo | 450 |
| `acc_eyes_fox` | Ojos de Zorro | 450 |
| `acc_eyes_cat` | Ojos de Gato | 450 |
| `acc_eyes_crow` | Ojos de Cuervo | 450 |
| `acc_eyes_deer` | Ojos de Ciervo | 450 |
| `acc_eyes_bear` | Ojos de Oso | 450 |

##### Garras (`garras`)
| ID | Nombre | Gold |
|----|--------|------|
| `acc_claws_wolf` | Garras de Lobo | 550 |
| `acc_claws_fox` | Garras de Zorro | 550 |
| `acc_claws_cat` | Garras de Gato | 550 |
| `acc_claws_crow` | Talones de Cuervo | 550 |
| `acc_claws_deer` | Pezuñas de Ciervo | 500 |
| `acc_claws_bear` | Garras de Oso | 550 |

##### Cabeza (`cabeza`)
| ID | Nombre | Essence |
|----|--------|---------|
| `acc_crown` | Corona | 3 |

##### Anteojos (`anteojos`)
| ID | Nombre | Gold |
|----|--------|------|
| `acc_glasses` | Anteojos | 300 |

---

## Huevos (`lib/items/eggs.ts`)

Los huevos son items especiales usados en el **sistema de fusión** para sustituir un slot cuando los dos Therians tienen distinta rareza.

| ID | Nombre | Rareza | Precio |
|----|--------|--------|--------|
| `egg_common` | Huevo Común | COMMON | 100 gold |
| `egg_uncommon` | Huevo Poco Común | UNCOMMON | 400 gold |
| `egg_rare` | Huevo Raro | RARE | 1500 gold |
| `egg_epic` | Huevo Épico | EPIC | 3 essence |
| `egg_legendary` | Huevo Legendario | LEGENDARY | 10 essence |

Los huevos se almacenan en `InventoryItem` (tipo `EGG`). Se compran en la tienda (sección de fusión) y se consumen al fusionar.

---

## Sistema de Fusión

La fusión combina dos Therians de la misma rareza para generar uno de la rareza superior.

### Requisitos

- Dos Therians del usuario con el **mismo rarity**
- O un Therian + un Huevo de la rareza equivalente
- El usuario debe tener el slot disponible para el nuevo Therian

### Flujo

```
TherianA (RARE) + TherianB (RARE)
  → generateTherianWithRarity(userId, secret, 'EPIC')
  → TherianA y TherianB eliminados (released)
  → Nuevo Therian EPIC creado
```

Si se usa un huevo:
```
TherianA (RARE) + egg_rare (del inventario)
  → mismo resultado
  → Sólo TherianA eliminado
  → egg_rare consumido del inventario
```

### Rareza progresión

```
COMMON → UNCOMMON → RARE → EPIC → LEGENDARY → MYTHIC
```

La fusión de dos MYTHIC no es posible (es el máximo).

**Endpoint:** `POST /api/therian/fuse`

---

## Runas (`lib/catalogs/runes.ts`)

Las runas aumentan estadísticas del Therian. Se equipan en `Therian.equippedRunes` y se aplican en tiempo de ejecución en `lib/therian-dto.ts`.

### Runas nombradas (16)

| ID | Nombre | Efectos |
|----|--------|---------|
| `v_1` | Vitalidad Menor | +2 VIT |
| `v_2` | Vitalidad Fuerte | +5 VIT |
| `v_3` | Vigor del Oso | +8 VIT |
| `v_4` | Sangre Hirviente | +12 VIT, −2 AGI |
| `a_1` | Agilidad Menor | +2 AGI |
| `a_2` | Agilidad Fuerte | +5 AGI |
| `a_3` | Paso del Viento | +8 AGI |
| `a_4` | Reflejo de Caza | +12 AGI, −2 INS |
| `i_1` | Instinto Menor | +2 INS |
| `i_2` | Instinto Fuerte | +5 INS |
| `i_3` | Tercer Ojo | +8 INS |
| `i_4` | Conexión Arcana | +12 INS, −2 CHA |
| `c_1` | Carisma Menor | +2 CHA |
| `c_2` | Carisma Fuerte | +5 CHA |
| `c_3` | Aura Magnética | +8 CHA |
| `c_4` | Presencia Real | +12 CHA, −2 VIT |

### Runas Duales (34 generadas proceduralmente)

IDs `mixed_0` a `mixed_33`. Combinan dos stats con valores variables.

### Inventario de runas

Las runas se almacenan en `RuneInventory` (por Therian, con `quantity`). Se obtienen de:
- Acciones diarias (RNG)
- Tienda (futuro)
- Recompensas de batalla (futuro)

### Equipado

- `POST /api/therian/runes` — `{ therianId, runeIds: string[] }`
- Las runas equipadas se listan en `Therian.equippedRunes` (JSON `string[]`)
- Los bonificadores se aplican en `toTherianDTO()` — los stats en el DTO ya los incluyen

---

## Accesorios — Formato de almacenamiento

Los accesorios se guardan en `Therian.accessories` como JSON:

**Formato actual (objeto por slot):**
```json
{
  "orejas": "ears_wolf",
  "cola": "tail_fox",
  "anteojos": "glasses"
}
```

**Formato legacy (array de strings):**
```json
["crown", "glasses"]
```

La función `parseEquippedAccessories()` en `lib/therian-dto.ts` migra automáticamente el formato legacy al nuevo al cargar el DTO.

### Slots disponibles

| Slot ID | Descripción |
|---------|-------------|
| `orejas` | Orejas de especie |
| `cola` | Cola de especie |
| `ojos` | Marcas de ojos |
| `garras` | Garras / pezuñas |
| `cabeza` | Accesorios de cabeza (corona) |
| `anteojos` | Anteojos |
