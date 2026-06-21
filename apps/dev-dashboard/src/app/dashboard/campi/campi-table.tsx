'use client'

import { Badge } from '@/components/ui/badge'
import { DataTable, type ColumnDef } from '@/components/custom/data-table'
import { CampoRowActions } from './campo-row-actions'

type Campo = {
  id: number
  nome_campo: string
  fk_struttura: number | null
  tipo_superficie: string | null
  prezzo_orario: number | string | null
  min_giocatori: number | null
  max_giocatori: number | null
  attivo: boolean | null
  coperto: boolean | null
  Strutture: { nome: string } | null
  Campi_Sport: { fk_sport: number; Sport: { nome_sport: string } | null }[] | null
}

type Struttura = { id: number; nome: string }
type Sport = { id: number; nome_sport: string }

type Props = {
  data: Campo[]
  strutture: Struttura[]
  sport: Sport[]
  action?: React.ReactNode
}

export function CampiTable({ data, strutture, sport, action }: Props) {
  const columns: ColumnDef<Campo>[] = [
    {
      key: 'nome_campo',
      header: 'Nome',
      sortable: true,
      searchValue: (c) => c.nome_campo ?? '',
      cell: (c) => <span className="font-medium whitespace-nowrap">{c.nome_campo}</span>,
    },
    {
      key: 'struttura',
      header: 'Struttura',
      sortable: true,
      searchValue: (c) => c.Strutture?.nome ?? '',
      cell: (c) => <span className="whitespace-nowrap">{c.Strutture?.nome ?? '—'}</span>,
    },
    {
      key: 'sport',
      header: 'Sport',
      searchValue: (c) => c.Campi_Sport?.map((cs) => cs.Sport?.nome_sport ?? '').join(' ') ?? '',
      cell: (c) => {
        const nomi = c.Campi_Sport?.map((cs) => cs.Sport?.nome_sport).filter(Boolean).join(', ')
        return <span className="whitespace-nowrap">{nomi || '—'}</span>
      },
    },
    {
      key: 'tipo_superficie',
      header: 'Superficie',
      sortable: true,
      searchValue: (c) => c.tipo_superficie ?? '',
      cell: (c) => <span className="whitespace-nowrap">{c.tipo_superficie ?? '—'}</span>,
    },
    {
      key: 'giocatori',
      header: 'Giocatori',
      cell: (c) => (
        <span className="whitespace-nowrap">
          {c.min_giocatori && c.max_giocatori ? `${c.min_giocatori} – ${c.max_giocatori}` : '—'}
        </span>
      ),
    },
    {
      key: 'prezzo_orario',
      header: 'Prezzo/ora',
      sortable: true,
      searchValue: (c) => c.prezzo_orario != null ? String(c.prezzo_orario) : '',
      cell: (c) => <span className="whitespace-nowrap">{c.prezzo_orario != null ? `€${c.prezzo_orario}` : '—'}</span>,
    },
    {
      key: 'coperto',
      header: 'Coperto',
      cell: (c) => <span>{c.coperto ? 'Sì' : 'No'}</span>,
    },
    {
      key: 'attivo',
      header: 'Stato',
      cell: (c) => (
        <Badge
          className={c.attivo ? 'bg-green-500 text-white hover:bg-green-600' : ''}
          variant={c.attivo ? 'default' : 'secondary'}
        >
          {c.attivo ? 'Attivo' : 'Inattivo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (c) => (
        <CampoRowActions
          campo={{
            id: c.id,
            nome_campo: c.nome_campo,
            fk_struttura: c.fk_struttura,
            tipo_superficie: c.tipo_superficie,
            prezzo_orario: c.prezzo_orario ? Number(c.prezzo_orario) : null,
            min_giocatori: c.min_giocatori,
            max_giocatori: c.max_giocatori,
            attivo: c.attivo,
            coperto: c.coperto,
            sport_ids: c.Campi_Sport?.map((cs) => cs.fk_sport) ?? [],
          }}
          strutture={strutture}
          sport={sport}
        />
      ),
    },
  ]

  return (
    <DataTable
      data={data}
      columns={columns}
      searchPlaceholder="Cerca campo..."
      action={action}
    />
  )
}
