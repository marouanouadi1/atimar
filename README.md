# Atimar

## Tech Stack

| Categoria           | Tecnologia                                      |
| ------------------- | ----------------------------------------------- |
| App cliente         | Expo + React Native + React Native Web          |
| Routing             | Expo Router                                     |
| Dashboard interna   | Next.js                                         |
| Workspace           | pnpm workspace con organizzazione Turborepo     |
| Database/Auth       | Supabase                                        |
| Codice condiviso    | Moduli di dominio, tipi e utility in `packages` |

## Struttura

```txt
apps/
  app/                  # app Expo installabile/eseguibile
  dev-dashboard/        # dashboard interna Next.js

packages/
  */                    # codice condiviso tra le app
```

Il progetto è organizzato come monorepo: dalla root si installano le dipendenze e si lanciano i comandi principali, che vengono poi delegati ai workspace corretti. Le app restano separate, mentre `packages/*` contiene codice riutilizzabile come dominio, tipi e funzioni condivise.

La configurazione è volutamente centralizzata quanto basta per lavorare dalla root senza dover entrare manualmente nei singoli folder. Per i dettagli specifici di una app, fare riferimento al relativo `README.md`.

## Installazione

```bash
pnpm install
```

## Sviluppo

```bash
pnpm app
pnpm web
pnpm dev-dashboard
pnpm android
pnpm ios
```

## Comandi dalla root

| Comando                    | Descrizione                                      |
| -------------------------- | ------------------------------------------------ |
| `pnpm app`                 | Avvia l'app Expo                                 |
| `pnpm web`                 | Avvia l'app Expo in modalità web                 |
| `pnpm dev`                 | Alias per `pnpm app`                             |
| `pnpm dev-dashboard`       | Avvia la dashboard interna                       |
| `pnpm android`             | Avvia l'app su Android                           |
| `pnpm ios`                 | Avvia l'app su iOS                               |
| `pnpm build`               | Esegue le build principali del monorepo          |
| `pnpm build:app`           | Build dell'app Expo                              |
| `pnpm build:web`           | Esporta la versione web dell'app Expo            |
| `pnpm build:dev-dashboard` | Build della dashboard interna                    |
| `pnpm lint`                | Esegue i controlli lint configurati              |
| `pnpm typecheck`           | Esegue il controllo TypeScript                   |
| `pnpm clean`               | Rimuove dipendenze, cache e output locali        |

## Codice condiviso

Il codice condiviso va tenuto in `packages/*` quando serve a più app o rappresenta logica di dominio comune. UI, componenti visuali e configurazioni specifiche restano invece dentro l'app che li usa.

Gli import condivisi sono gestiti tramite alias `@atimar/*` dove necessario.
