import { Topbar } from '@/components/topbar'
import { getCitta, getStrutture, getSport } from '@atimar/api'
import { CreaStrutturaDialog } from '@/components/dialogs/crea-struttura-dialog'
import { StrutturTable } from './strutture-table'

export default async function StrutturePage() {
  const [{ data: strutture, error }, { data: citta }, { data: sport }] = await Promise.all([
    getStrutture(),
    getCitta(),
    getSport(),
  ])

  const cittaMap = Object.fromEntries((citta ?? []).map((c) => [c.id, c.nome]))

  return (
    <>
      <Topbar title="Strutture Sportive" />
      <div className="p-6 overflow-x-hidden">
        {error && (
          <p className="text-sm text-destructive mb-4">{error.message}</p>
        )}
        <StrutturTable
          data={strutture ?? [] as any}
          cittaMap={cittaMap}
          sport={sport ?? []}
          action={<CreaStrutturaDialog citta={citta ?? []} />}
        />
      </div>
    </>
  )
}
