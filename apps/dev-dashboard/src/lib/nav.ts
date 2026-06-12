export type NavItem = { label: string; href: string }

export type NavSection = {
  id: string
  label: string
  icon: string
  href: string
  sub: NavItem[]
}

export const NAV_MAIN: NavSection[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'Zap',
    href: '/dashboard',
    sub: [],
  },
  {
    id: 'strutture',
    label: 'Strutture Sportive',
    icon: 'Building2',
    href: '/dashboard/strutture',
    sub: [
      { label: 'Lista strutture', href: '/dashboard/strutture' },
      { label: 'Aggiungi struttura', href: '/dashboard/strutture/aggiungi' },
      { label: 'Categorie', href: '/dashboard/strutture/categorie' },
    ],
  },
  {
    id: 'campi',
    label: 'Campi Sportivi',
    icon: 'Volleyball',
    href: '/dashboard/campi',
    sub: [
      { label: 'Lista campi', href: '/dashboard/campi' },
      { label: 'Aggiungi campo', href: '/dashboard/campi/aggiungi' },
      { label: 'Sport', href: '/dashboard/campi/sport' },
    ],
  },
  {
    id: 'utenti',
    label: 'Utenti',
    icon: 'User',
    href: '/dashboard/utenti',
    sub: [
      { label: 'Lista utenti', href: '/dashboard/utenti' },
      { label: 'Aggiungi utente', href: '/dashboard/utenti/aggiungi' },
    ],
  },
]
