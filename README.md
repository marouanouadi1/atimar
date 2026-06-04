# Atimar

## 🛠 Tech Stack

| Categoria | Tecnologia |
|---|---|
| App universale | Expo + React Native + React Native Web |
| Routing | Expo Router |
| Dashboard temporanea | Next.js |
| Monorepo Tooling | Turborepo & pnpm workspaces |
| Database/Auth | Supabase |
| UI condivisa | Package interni `@atimar/ui-*`, `@atimar/theme` |

---

## 🏗 Struttura del Monorepo

```txt
apps/
  app/             # package @atimar/app: app principale Expo per iOS, Android e Web
  dev-dashboard/   # dashboard temporanea per super admin

packages/
  data/            # dati demo e accesso dati condivisibile
  theme/           # design tokens condivisi
  types/           # tipi TypeScript condivisi
  ui-core/         # primitive UI/framework-agnostic dove possibile
  ui-native/       # componenti React Native usati da mobile e web Expo
  ui-web/          # componenti web-specific, da usare solo se serve
  utils/           # funzioni pure condivise
```

La direzione architetturale è: **una sola app Expo universale** (`@atimar/app`) per mobile e web utente. Il sito/app web si avvia tramite Expo Web, non tramite una seconda app Next separata.

---

## 🚀 Come Iniziare

### 1. Prerequisiti

Assicurati di avere installato:

- **Node.js** (v24+)
- **pnpm** (`npm install -g pnpm`)
- **Turborepo** (`npm install -g turbo`)

### 2. Installazione

Dalla cartella principale del progetto:

```bash
pnpm install
```

### 3. Sviluppo

Avvia la demo web visibile dell'app Expo:

```bash
pnpm web
```

Apri l'URL mostrato da Expo nel terminale. La route `/` su web mostra una landing demo con collegamenti a onboarding, login e home app.

Avvia l'app Expo generica:

```bash
pnpm app
```

Avvia mobile direttamente:

```bash
pnpm android
pnpm ios
```

Avvia la dashboard temporanea:

```bash
pnpm dev-dashboard
```

---

## ⌨️ Comandi Utili dalla Root

| Comando | Descrizione |
|---|---|
| `pnpm web` | Avvia l'app Expo in modalità web (`expo start --web`) |
| `pnpm app` | Avvia solo l'app Expo (`@atimar/app`) |
| `pnpm dev` | Avvia app Expo universale e dashboard temporanea tramite Turbo |
| `pnpm android` | Avvia l'app Expo su Android |
| `pnpm ios` | Avvia l'app Expo su iOS |
| `pnpm dev-dashboard` | Avvia solo la dashboard temporanea Next.js |
| `pnpm build` | Esegue build app web Expo + dashboard tramite Turbo |
| `pnpm build:web` | Esporta la versione web dell'app Expo |
| `pnpm build:app` | Build dell'app Expo universale |
| `pnpm build:dev-dashboard` | Build della dashboard temporanea |
| `pnpm clean` | Pulizia cache Turbo e `node_modules` |

---

## 🧩 Condivisione del Codice

Per utilizzare un package locale dentro una delle app:

1. Aggiungilo al `package.json` dell'app, per esempio:

```json
"@atimar/types": "workspace:*"
```

2. Lancia:

```bash
pnpm install
```

3. Importalo normalmente:

```ts
import type { User } from "@atimar/types";
```

Regola pratica:

```txt
apps/      = prodotti avviabili/deployabili
packages/  = codice riusabile
```

Per componenti condivisi tra mobile e web Expo, preferire componenti React Native dentro `packages/ui-native`.

---

## 📝 Note per lo Sviluppo

- **Web principale:** servito da Expo Web tramite `@atimar/app`.
- **Demo web:** `apps/app/app/index.web.tsx` mostra una landing demo solo per browser.
- **Mobile:** `apps/app/app/index.tsx` mantiene il gate onboarding/login.
- **Dashboard:** rimane separata perché è uno strumento interno temporaneo.
- **SSR su Web:** per l'app Expo web è usato `output: "single"` per compatibilità immediata.
- **Porte:** Next dashboard gira solitamente su `localhost:3000`; Expo/Metro su `localhost:8081` o sulla porta proposta da Expo.
