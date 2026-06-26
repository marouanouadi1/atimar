import { Topbar } from '@/components/topbar'
import { getCampi, getStrutture, getSport } from '@atimar/api'
import { CreaCampoDialog } from '@/components/dialogs/crea-campo-dialog'
import { CampiTable } from './campi-table'

export default async function CampiPage() {
  const [{ data: campi, error }, { data: strutture }, { data: sport }] = await Promise.all([
    getCampi(),
    getStrutture(),
    getSport(),
  ])

  return (
    <>
      <Topbar title="Campi Sportivi" />
      <div className="p-6 overflow-x-hidden">
        {error && (
          <p className="text-sm text-destructive mb-4">{error.message}</p>
        )}
        <CampiTable
          data={(campi ?? []) as Parameters<typeof CampiTable>[0]['data']}
          strutture={strutture ?? []}
          sport={sport ?? []}
          action={<CreaCampoDialog strutture={strutture ?? []} sport={sport ?? []} />}
        />
      </div>
    </>
  )
}
