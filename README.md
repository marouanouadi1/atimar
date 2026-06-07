# Atimar

## Tech Stack

| Categoria | Tecnologia |
|---|---|
| App cliente | Expo + React Native + React Native Web |
| Routing app cliente | Expo Router |
| Dashboard super admin | Next.js dentro `apps/app/dev-dashboard` |
| Workspace | pnpm con un solo package applicativo (`apps/app`) |
| Database/Auth | Supabase |
| Dominio condiviso | Entità, tipi, selector e struttura DB in `packages/data` e `packages/types` |

## Struttura

```txt
apps/
  app/                    # unico package installabile/eseguibile
    app/                  # route Expo Router per app cliente
    dev-dashboard/        # app Next.js interna per super admin
    package.json          # dipendenze centralizzate: Expo, Next, React
    tsconfig.json         # TypeScript condiviso
    metro.config.js       # alias runtime per Expo

packages/
  data/src/               # selector, mock data e poi query Supabase
  theme/src/              # design tokens condivisi
  types/src/              # entità e tipi DB condivisi
  ui-native/src/          # componenti React Native solo per app cliente
  utils/src/              # funzioni pure condivise
```

La dashboard super admin resta Next.js. Non usa i componenti Expo/React Native e non dipende da `ui-native`. Condivide invece lo stesso dominio dell'app cliente: entità, tipi, selector e futura struttura Supabase.

I folder in `packages/*` sono sorgenti condivisi, non package pnpm autonomi. Gli alias dell'app Expo sono gestiti da `apps/app/tsconfig.json` e `apps/app/metro.config.js`. La dashboard ha un `tsconfig.json` minimo solo perché Next.js richiede un progetto TypeScript dentro la propria root.

## Installazione

```bash
pnpm install
```

Il lockfile viene rigenerato da `pnpm install` a partire dall'unico workspace reale: `apps/app`.

## Sviluppo

```bash
pnpm web
pnpm app
pnpm android
pnpm ios
pnpm dev-dashboard
```

## Comandi dalla root

| Comando | Descrizione |
|---|---|
| `pnpm web` | Avvia l'app Expo in modalità web |
| `pnpm app` | Avvia l'app Expo |
| `pnpm dev` | Alias per `pnpm app` |
| `pnpm android` | Avvia Android |
| `pnpm ios` | Avvia iOS |
| `pnpm dev-dashboard` | Avvia la dashboard Next.js dentro `apps/app/dev-dashboard` |
| `pnpm build:web` | Esporta la versione web Expo |
| `pnpm build:app` | Build dell'app Expo universale |
| `pnpm build:dev-dashboard` | Build della dashboard interna |
| `pnpm clean` | Rimuove dipendenze, cache e output locali |

## Codice condiviso

App cliente e dashboard possono importare lo stesso dominio dati:

```ts
import { getCourtListItems } from "@atimar/data";
import type { Court, Venue, Booking } from "@atimar/types";
```

Non aggiungere `workspace:*` per `@atimar/*`: quei moduli non sono package separati. Se serve un nuovo modulo condiviso, crea `packages/<nome>/src` e registra l'alias in `apps/app/tsconfig.json`. Per Expo aggiorna anche `apps/app/metro.config.js`; per la dashboard aggiorna `apps/app/dev-dashboard/tsconfig.json`.

Regola pratica: `packages/types` e `packages/data` descrivono il dominio comune e la struttura DB; `packages/ui-native` resta solo per l'app cliente Expo.
