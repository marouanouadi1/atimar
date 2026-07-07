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
| `pnpm db:migration:list`   | Mostra lo stato migration locale/remoto          |
| `pnpm db:migration:new -- nome_modifica` | Crea una nuova migration Supabase    |
| `pnpm db:migration:repair -- versione --status applied` | Allinea la history remota |
| `pnpm db:pull -- nome_modifica` | Importa modifiche remote in una migration     |
| `pnpm db:push`             | Applica le migration locali al progetto linkato  |
| `pnpm db:push:dry-run`     | Mostra le migration che verrebbero applicate     |
| `pnpm db:reset`            | Ricostruisce il database locale dalle migration  |
| `pnpm db:lint`             | Esegue il lint dello schema sul database locale  |
| `pnpm db:types`            | Rigenera i tipi TypeScript dal database linkato  |
| `pnpm clean`               | Rimuove dipendenze, cache e output locali        |

## Supabase

Supabase segue un flusso migration-first: ogni modifica stabile allo schema deve
essere descritta da un file SQL in `supabase/migrations` e committata insieme al
codice applicativo collegato. La dashboard remota va usata per ispezione o per
emergenze; se una modifica nasce fuori dal repository, va riportata subito in
una migration prima di considerarla definitiva.

### Prima baseline

Il progetto locale è già linkato al progetto Supabase remoto. Per importare lo
schema remoto attuale come baseline:

```powershell
$env:SUPABASE_DB_PASSWORD = "<database-password>"
supabase migration list
pnpm db:pull -- initial_schema
pnpm db:migration:repair -- 20260706200224 --status applied
```

Il file generato in `supabase/migrations` rappresenta il punto di partenza
versionato. Non includere import massivi o dati temporanei nella baseline schema.
La `repair` va eseguita una sola volta per dire a Supabase che la baseline è già
presente sul remoto; senza questo passaggio `db:push` proverebbe ad applicarla di
nuovo.

### Nuove modifiche allo schema

Ci sono due modi per introdurre una modifica, a seconda di dove nasce.

**1. Modifica scritta direttamente in SQL** (il caso più comune: alter column,
nuova tabella, indice, ecc.):

```bash
pnpm db:migration:new -- nome_modifica
# scrivere lo SQL nel file generato in supabase/migrations
pnpm db:reset
pnpm db:lint
pnpm db:types
```

**2. Modifica fatta dal dashboard Supabase remoto** (es. urgenza o esplorazione
via UI): non è mai definitiva finché non viene riportata nel repo tramite diff:

```powershell
$env:SUPABASE_DB_PASSWORD = "<database-password>"
pnpm db:pull -- nome_modifica
pnpm db:migration:repair -- <versione> --status applied
pnpm db:reset
pnpm db:lint
pnpm db:types
```

`db:pull` genera la migration confrontando lo schema remoto con la history
locale; `db:migration:repair` dice a Supabase che quella versione è già
applicata sul remoto, altrimenti `db:push` proverebbe ad applicarla di nuovo.

Non modificare a mano una migration già applicata o condivisa: creare una nuova
migration incrementale. Dopo ogni modifica allo schema, rigenerare e committare
`packages/db-types/src/index.ts` insieme alla migration.

### Deploy

Il deploy iniziale e manuale:

```powershell
$env:SUPABASE_DB_PASSWORD = "<database-password>"
pnpm db:push
```

Usare `pnpm db:push:dry-run` prima del deploy quando si vuole vedere cosa verrà
applicato senza modificare il database remoto.

### Tipi TypeScript

Dopo ogni modifica allo schema, rigenerare i tipi condivisi dal database linkato:

```bash
pnpm db:types
```

### Dati e seed

`supabase/seed.sql` è riservato a seed locali o demo. Import massivi come quello
di Piacenza devono restare in script dedicati o diventare job idempotenti: non
vanno trattati come migration di schema e non devono essere mescolati alla
baseline o alle migration strutturali.

## Codice condiviso

Il codice condiviso va tenuto in `packages/*` quando serve a più app o rappresenta logica di dominio comune. UI, componenti visuali e configurazioni specifiche restano invece dentro l'app che li usa.

Gli import condivisi sono gestiti tramite alias `@atimar/*` dove necessario.
