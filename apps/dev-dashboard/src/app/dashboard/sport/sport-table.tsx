'use client'

import { DataTable, type ColumnDef } from '@/components/custom/data-table'
import { SportRowActions } from './sport-row-actions'

type Sport = {
  id: number
  nome_sport: string
  slug: string
  aggiornato_il: string
}

type Props = {
  data: Sport[]
  action?: React.ReactNode
}

export function SportTable({ data, action }: Props) {
  const columns: ColumnDef<Sport>[] = [
    {
      key: 'nome_sport',
      header: 'Nome',
      sortable: true,
      searchValue: (s) => s.nome_sport ?? '',
      cell: (s) => <span className="font-medium">{s.nome_sport}</span>,
    },
    {
      key: 'aggiornato_il',
      header: 'Aggiornato il',
      sortable: true,
      searchValue: (s) => s.aggiornato_il ?? '',
      cell: (s) => (
        <span className="text-muted-foreground text-sm">
          {new Date(s.aggiornato_il).toLocaleDateString('it-IT')}
        </span>
      ),
    },
    {
      key: 'slug',
      header: 'Slug',
      sortable: true,
      searchValue: (s) => s.slug ?? '',
      cell: (s) => <span className="font-mono text-xs text-muted-foreground">{s.slug}</span>,
    },
    {
      key: 'actions',
      header: '',
      cell: (s) => <SportRowActions id={s.id} nome={s.nome_sport} slug={s.slug} />,
    },
  ]

  return (
    <DataTable
      data={data}
      columns={columns}
      searchPlaceholder="Cerca sport..."
      action={action}
    />
  )
}
