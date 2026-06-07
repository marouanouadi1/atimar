# Atimar

## Tech Stack

| Categoria | Tecnologia |
|---|---|
| App universale | Expo + React Native + React Native Web |
| Routing app cliente | Expo Router |
| Dashboard interna | Next.js dentro `apps/app/dev-dashboard` |
| Workspace | pnpm con un solo package applicativo (`apps/app`) |
| Database/Auth | Supabase |
| Codice condiviso | Sorgenti locali in `packages/*`, risolti via alias |

## Struttura

```txt
apps/
  app/                    # unico package installabile/eseguibile
    app/                  # route Expo Router per app cliente
    dev-dashboard/        # app Next.js interna
    package.json          # dipendenze centralizzate
    tsconfig.json         # TypeScript condiviso
    metro.config.js       # alias runtime per sorgenti condivisi

packages/
  data/src/
  theme/src/
  types/src/
  ui-native/src/
  utils/src/
```

La direzione architetturale è una sola app Expo universale per mobile e web utente. La dashboard interna non è un package separato: vive dentro `apps/app/dev-dashboard`, usa Next.js e condivide la stessa installazione di React dell'app Expo.

I folder in `packages/*` sono sorgenti condivisi, non package pnpm autonomi. Gli alias sono gestiti da `apps/app/tsconfig.json` e `apps/app/metro.config.js`.

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

Importa i sorgenti condivisi con alias stabili:

```ts
import { theme } from "@atimar/theme";
import type { User } from "@atimar/types";
```

Non aggiungere `workspace:*` per `@atimar/*`: quei moduli non sono package separati. Se serve un nuovo modulo condiviso, crea `packages/<nome>/src` e registra l'alias in `apps/app/tsconfig.json` e `apps/app/metro.config.js`. Aggiorna `apps/app/dev-dashboard/next.config.ts` solo se la dashboard deve importarlo a runtime.

Per componenti condivisi tra mobile e web Expo, preferire componenti React Native dentro `packages/ui-native/src`. La dashboard interna resta web/Next e non deve usare `ui-native` salvo scelta esplicita.
