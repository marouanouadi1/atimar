# Atimar Dev Dashboard — Spec fase 1

**Data:** 2026-06-11  
**Stack:** Next.js 16 · App Router · React 19 · shadcn · Tailwind v4 · Supabase Auth

---

## Contesto

Pannello gestionale interno riservato ai soli sviluppatori Atimar (superadmin). Serve per creare e gestire i dati della piattaforma Atimar (strutture sportive, campi, utenti). Il DB Supabase non è ancora progettato — questa fase 1 costruisce autenticazione, navigazione e pagine placeholder pronte per ricevere le integrazioni dati nella fase 2.

---

## Autenticazione

- Provider: **Supabase Auth** (email + password)
- Pacchetti: `@supabase/supabase-js` (client) + `@supabase/ssr` (cookie-based session per App Router)
- Sessione gestita via cookie con middleware Next.js (`middleware.ts`)
- Tutte le route `/dashboard/*` sono protette: redirect a `/login` se non autenticato
- Nessuna registrazione pubblica — solo account creati manualmente in Supabase

**Route auth:**
- `GET /login` → pagina login pubblica
- `POST /api/auth/logout` → logout + redirect a `/login`

---

## Layout

Struttura a **tre colonne**:

```
[ icon-sidebar 52px ] [ sub-sidebar 180px ] [ main content flex-1 ]
```

**Icon sidebar (sinistra, fissa):**
- Icona per ogni sezione principale
- Icona attiva evidenziata (bg blu scuro + icona blu)
- In fondo: pulsante impostazioni

**Sub-sidebar (espandibile per sezione):**
- Mostra voci specifiche della sezione attiva
- Titolo sezione in cima
- Voce attiva con bordo sinistro blu

**Main content:**
- Topbar con titolo pagina, theme toggle (🌓), e pulsante azione primaria
- Contenuto specifico per pagina

---

## Navigazione — sezioni sidebar

| Icona | Sezione | Route |
|---|---|---|
| ⚡ | Dashboard | `/dashboard` |
| 🏟️ | Strutture Sportive | `/dashboard/strutture` |
| ⚽ | Campi Sportivi | `/dashboard/campi` |
| 👤 | Utenti | `/dashboard/utenti` |
| ⚙️ | Impostazioni | `/dashboard/impostazioni` |

---

## Tema

- Dark/light toggle persistito in `localStorage` e applicato via classe `.dark` su `<html>`
- Default: dark mode
- Toggle visibile nella topbar di ogni pagina (🌓)
- Il tema usa le CSS variables shadcn già configurate in `globals.css`

---

## Pagine — scope fase 1

### `/login`
- Card centrata su schermo intero
- Logo/brand "ATIMAR" in cima
- Campi email + password
- Pulsante "Accedi"
- Gestione errori (credenziali errate, rete)
- Redirect a `/dashboard` dopo login riuscito

### `/dashboard` (home)
- Pagina di benvenuto con 3 stat card placeholder (Strutture, Campi, Utenti)
- Valori statici per ora (`—` o `0`)

### `/dashboard/strutture`
- Sottomenu: Lista strutture, Aggiungi struttura, Categorie
- Tabella placeholder con colonne: Nome, Città, Stato, Azioni
- Dati mock (2-3 righe statiche) per mostrare la struttura

### `/dashboard/campi`
- Sottomenu: Lista campi, Aggiungi campo, Sport
- Tabella placeholder con colonne: Nome, Struttura, Sport, Stato, Azioni
- Dati mock

### `/dashboard/utenti`
- Sottomenu: Lista utenti, Aggiungi utente
- Tabella placeholder con colonne: Email, Ruolo, Creato il, Azioni
- Dati mock

### `/dashboard/impostazioni`
- Placeholder con messaggio "Sezione in costruzione"

---

## Componenti shadcn da usare

Installare via `npx shadcn add`:
- `button`
- `input`
- `label`
- `table`
- `badge`
- `separator`
- `tooltip` (per le icone sidebar)
- `avatar` (topbar utente loggato)

`card` è già presente nel progetto.

---

## Struttura file

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx          ← sidebar + sottomenu + topbar
│   │   ├── page.tsx            ← home con stat cards
│   │   ├── strutture/
│   │   │   └── page.tsx
│   │   ├── campi/
│   │   │   └── page.tsx
│   │   ├── utenti/
│   │   │   └── page.tsx
│   │   └── impostazioni/
│   │       └── page.tsx
├── components/
│   ├── ui/                     ← shadcn (già esistenti + nuovi)
│   ├── sidebar/
│   │   ├── icon-sidebar.tsx
│   │   └── sub-sidebar.tsx
│   └── topbar.tsx
├── lib/
│   ├── utils.ts                ← già esistente
│   └── supabase.ts             ← client Supabase
└── middleware.ts               ← protezione route
```

---

## Fuori scope (fase 2)

- Form CRUD reali collegati al DB
- Schema Supabase e tabelle
- Gestione ruoli/permessi granulari
- Upload immagini
- Notifiche real-time
- Ricerca e filtri funzionanti

---

## Verifica

1. `npm run dev` → app avviata senza errori
2. Navigare a `/dashboard` → redirect a `/login` (non autenticato)
3. Login con credenziali Supabase → redirect a `/dashboard`
4. Sidebar: click su ogni icona → sottomenu corretto + route corretta
5. Toggle tema → dark/light switch + persistenza dopo refresh
6. Tutte le pagine placeholder visibili senza errori
