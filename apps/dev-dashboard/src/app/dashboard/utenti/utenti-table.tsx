'use client'

import { DataTable, type ColumnDef } from '@/components/custom/data-table'

type Profilo = {
  id: string
  nome_completo: string | null
  bio: string | null
  url_avatar: string | null
  raggio_preferito_km: number | null
  created_at: string
  aggiornato_il: string
}

type Props = {
  data: Profilo[]
}

export function UtentiTable({ data }: Props) {
  const columns: ColumnDef<Profilo>[] = [
    {
      key: 'nome_completo',
      header: 'Nome',
      sortable: true,
      searchValue: (p) => p.nome_completo ?? '',
      cell: (p) => <span className="font-medium">{p.nome_completo ?? '—'}</span>,
    },
    {
      key: 'id',
      header: 'ID',
      searchValue: (p) => p.id,
      cell: (p) => <span className="text-muted-foreground text-xs font-mono">{p.id}</span>,
    },
    {
      key: 'bio',
      header: 'Bio',
      searchValue: (p) => p.bio ?? '',
      cell: (p) => <span className="text-muted-foreground max-w-[250px] truncate block">{p.bio ?? '—'}</span>,
    },
    {
      key: 'raggio_preferito_km',
      header: 'Raggio (km)',
      sortable: true,
      searchValue: (p) => p.raggio_preferito_km != null ? String(p.raggio_preferito_km) : '',
      cell: (p) => <span>{p.raggio_preferito_km != null ? `${p.raggio_preferito_km} km` : '—'}</span>,
    },
    {
      key: 'created_at',
      header: 'Registrato il',
      sortable: true,
      searchValue: (p) => p.created_at,
      cell: (p) => (
        <span className="text-muted-foreground text-sm whitespace-nowrap">
          {new Date(p.created_at).toLocaleDateString('it-IT')}
        </span>
      ),
    },
    {
      key: 'aggiornato_il',
      header: 'Aggiornato il',
      sortable: true,
      searchValue: (p) => p.aggiornato_il,
      cell: (p) => (
        <span className="text-muted-foreground text-sm whitespace-nowrap">
          {new Date(p.aggiornato_il).toLocaleDateString('it-IT')}
        </span>
      ),
    },
  ]

  return (
    <DataTable
      data={data}
      columns={columns}
      searchPlaceholder="Cerca utente..."
    />
  )
}
