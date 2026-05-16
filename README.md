## 🛠 Tech Stack

| Categoria | Tecnologia |
|---|---|
| Mobile | Expo (React Native) |
| Web | Next.js (App Router, React 19) |
| Monorepo Tooling | Turborepo & pnpm |
| Database/Auth | Supabase |
| Styling | Tailwind CSS (Web) & NativeWind (Mobile - planned) |

---

## 🚀 Come Iniziare

### 1. Prerequisiti

Assicurati di avere installato:

- **Node.js** (v24+)
- **pnpm** (`npm install -g pnpm`)
- **Turborepo** (`npm install -g turbo`)

### 2. Installazione

Dalla cartella principale del progetto, scarica tutte le dipendenze:

```bash
pnpm install
```

### 3. Sviluppo

Per avviare tutti i progetti contemporaneamente:

```bash
pnpm dev
```

---

## ⌨️ Comandi Utili (Dalla Root)

| Comando | Descrizione |
|---|---|
| `pnpm dev` | Avvia Dashboard e Mobile in parallelo |
| `pnpm mobile` | Avvia solo l'app Expo (web browser)|
| `pnpm web` | Avvia solo il sito web Next.js |
| `pnpm dev-dashboard` | Avvia solo la dashboard Next.js |
| `pnpm build` | Esegue la build di tutto il progetto con caching di Turbo |
| `pnpm android` | Avvia l'app mobile direttamente su emulatore Android |
| `pnpm ios` | Avvia l'app mobile direttamente su emulatore iOS |

---

## 🏗 Condivisione del Codice

Per utilizzare un pacchetto locale (es. `packages/types`) dentro una delle app:

1. Aggiungilo al `package.json` dell'app: `"@atimar/types": "workspace:*"`
2. Lancia `pnpm install`.
3. Importalo normalmente nel codice: `import { User } from "@atimar/types"`.

---

## 📝 Note per lo Sviluppo

- **SSR su Web:** Per l'app mobile in modalità web, l'SSR è stato disattivato (`output: "single"`) per garantire la compatibilità immediata con Supabase.
- **Porte:** La dashboard gira solitamente su `localhost:3000`, mentre il Metro bundler di Expo su `localhost:8081`.
