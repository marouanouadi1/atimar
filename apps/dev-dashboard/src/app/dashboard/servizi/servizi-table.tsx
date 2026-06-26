'use client'

import { Badge } from '@/components/ui/badge'
import { DataTable, type ColumnDef } from '@/components/custom/data-table'
import { ServizioRowActions } from './servizio-row-actions'

type Servizio = {
  id: number
  nome_servizio: string
  descrizione: string | null
  attivo: boolean | null
}

type Props = {
  data: Servizio[]
  action?: React.ReactNode
}

export function ServiziTable({ data, action }: Props) {
  const columns: ColumnDef<Servizio>[] = [
    {
      key: 'nome_servizio',
      header: 'Nome',
      sortable: true,
      searchValue: (s) => s.nome_servizio ?? '',
      cell: (s) => <span className="font-medium">{s.nome_servizio}</span>,
    },
    {
      key: 'descrizione',
      header: 'Descrizione',
      searchValue: (s) => s.descrizione ?? '',
      cell: (s) => <span className="text-muted-foreground">{s.descrizione ?? '—'}</span>,
    },
    {
      key: 'attivo',
      header: 'Stato',
      cell: (s) => (
        <Badge
          className={s.attivo ? 'bg-green-500 text-white hover:bg-green-600' : ''}
          variant={s.attivo ? 'default' : 'secondary'}
        >
          {s.attivo ? 'Attivo' : 'Inattivo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (s) => (
        <ServizioRowActions servizio={s} />
      ),
    },
  ]

  return (
    <DataTable
      data={data}
      columns={columns}
      searchPlaceholder="Cerca servizio..."
      action={action}
    />
  )
}
