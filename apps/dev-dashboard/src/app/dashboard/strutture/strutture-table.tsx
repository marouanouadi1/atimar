'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable, type ColumnDef } from '@/components/custom/data-table'
import { StrutturaRowActions } from './struttura-row-actions'
import Link from 'next/link'

type SportEntry = { fk_sport: number; Sport: { nome_sport: string } | null }
type CampoEntry = { Campi_Sport: SportEntry[] | null }

type Struttura = {
  id: number
  nome: string
  fk_citta: number | null
  indirizzo: string | null
  posizione: string | null
  latitudine: number | null
  longitudine: number | null
  telefono: string | null
  cellulare: string | null
  email: string | null
  link_sito_web: string | null
  link_prenotazione_esterno: string | null
  prezzo_orario: number | string | null
  descrizione: string | null
  sempre_aperto: boolean | null
  verificata: boolean | null
  attivo: boolean | null
  Campi: CampoEntry[] | null
}

type Props = {
  data: Struttura[]
  cittaMap: Record<number, string>
  sport: { id: number; nome_sport: string }[]
  action?: React.ReactNode
}

function getSportIds(struttura: Struttura): number[] {
  return struttura.Campi?.flatMap((c) => c.Campi_Sport?.map((cs) => cs.fk_sport) ?? []) ?? []
}

export function StrutturTable({ data, cittaMap, sport, action }: Props) {
  const [selectedSport, setSelectedSport] = useState<Set<number>>(new Set())

  const allSport = [...sport].sort((a, b) => a.nome_sport.localeCompare(b.nome_sport))

  function toggleSport(id: number) {
    setSelectedSport((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = selectedSport.size === 0
    ? data
    : data.filter((s) => {
        const ids = getSportIds(s)
        return Array.from(selectedSport).every((sid) => ids.includes(sid))
      })

  const columns: ColumnDef<Struttura>[] = [
    {
      key: 'nome',
      header: 'Nome',
      sortable: true,
      searchValue: (s) => s.nome ?? '',
      cell: (s) => (
        <span className="font-medium whitespace-nowrap relative">
          <Link href={`/dashboard/strutture/${s.id}`} className="absolute inset-0" />
          {s.nome}
        </span>
      ),
    },
    {
      key: 'fk_citta',
      header: 'Città',
      sortable: true,
      searchValue: (s) => (s.fk_citta != null ? (cittaMap[s.fk_citta] ?? '') : ''),
      cell: (s) => <span className="whitespace-nowrap">{s.fk_citta != null ? (cittaMap[s.fk_citta] ?? '—') : '—'}</span>,
    },
    {
      key: 'indirizzo',
      header: 'Indirizzo',
      sortable: true,
      searchValue: (s) => s.indirizzo ?? '',
      cell: (s) => <span className="whitespace-nowrap">{s.indirizzo ?? '—'}</span>,
    },
    {
      key: 'posizione',
      header: 'Posizione',
      searchValue: (s) => s.posizione ?? '',
      cell: (s) => <span className="whitespace-nowrap">{s.posizione ?? '—'}</span>,
    },
    {
      key: 'latitudine',
      header: 'Lat',
      cell: (s) => <span className="whitespace-nowrap">{s.latitudine ?? '—'}</span>,
    },
    {
      key: 'longitudine',
      header: 'Lng',
      cell: (s) => <span className="whitespace-nowrap">{s.longitudine ?? '—'}</span>,
    },
    {
      key: 'telefono',
      header: 'Telefono',
      searchValue: (s) => s.telefono ?? '',
      cell: (s) => <span className="whitespace-nowrap">{s.telefono ?? '—'}</span>,
    },
    {
      key: 'cellulare',
      header: 'Cellulare',
      searchValue: (s) => s.cellulare ?? '',
      cell: (s) => <span className="whitespace-nowrap">{s.cellulare ?? '—'}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      searchValue: (s) => s.email ?? '',
      cell: (s) => <span className="whitespace-nowrap">{s.email ?? '—'}</span>,
    },
    {
      key: 'link_sito_web',
      header: 'Sito web',
      cell: (s) => s.link_sito_web
        ? <a href={s.link_sito_web} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline whitespace-nowrap relative z-10">Link</a>
        : <span>—</span>,
    },
    {
      key: 'link_prenotazione_esterno',
      header: 'Prenotazione esterna',
      cell: (s) => s.link_prenotazione_esterno
        ? <a href={s.link_prenotazione_esterno} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline whitespace-nowrap relative z-10">Link</a>
        : <span>—</span>,
    },
    {
      key: 'prezzo_orario',
      header: 'Prezzo/ora',
      sortable: true,
      searchValue: (s) => s.prezzo_orario != null ? String(s.prezzo_orario) : '',
      cell: (s) => <span className="whitespace-nowrap">{s.prezzo_orario != null ? `€${s.prezzo_orario}` : '—'}</span>,
    },
    {
      key: 'descrizione',
      header: 'Descrizione',
      searchValue: (s) => s.descrizione ?? '',
      cell: (s) => <span className="max-w-[200px] truncate block">{s.descrizione ?? '—'}</span>,
    },
    {
      key: 'sempre_aperto',
      header: 'Sempre aperto',
      cell: (s) => (
        <Badge variant={s.sempre_aperto ? 'default' : 'secondary'}>
          {s.sempre_aperto ? 'Sì' : 'No'}
        </Badge>
      ),
    },
    {
      key: 'verificata',
      header: 'Verificata',
      cell: (s) => (
        <Badge variant={s.verificata ? 'default' : 'secondary'}>
          {s.verificata ? 'Sì' : 'No'}
        </Badge>
      ),
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
        <div className="relative z-10">
          <StrutturaRowActions id={s.id} nome={s.nome} />
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      {allSport.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtra per sport:</span>
          {allSport.map((s) => {
            const active = selectedSport.has(s.id)
            return (
              <Button
                key={s.id}
                variant={active ? 'default' : 'outline'}
                size="sm"
                className="h-7 rounded-full px-3 text-xs"
                onClick={() => toggleSport(s.id)}
              >
                {s.nome_sport}
              </Button>
            )
          })}
          {selectedSport.size > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground"
              onClick={() => setSelectedSport(new Set())}
            >
              Rimuovi filtri
            </Button>
          )}
        </div>
      )}
      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Cerca struttura..."
        action={action}
      />
    </div>
  )
}
