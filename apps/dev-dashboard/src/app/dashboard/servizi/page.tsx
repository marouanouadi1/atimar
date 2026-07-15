import { Topbar } from '@/components/topbar'
import { getServizi } from '@atimar/api'
import { CreaServizioDialog } from '@/components/dialogs/crea-servizio-dialog'
import { ServiziTable } from './servizi-table'

export default async function ServiziPage() {
  const { data: servizi, error } = await getServizi()

  return (
    <>
      <Topbar title="Servizi" />
      <div className="p-6">
        {error && (
          <p className="text-sm text-destructive mb-4">{error.message}</p>
        )}
        <ServiziTable
          data={servizi ?? []}
          action={<CreaServizioDialog key="crea-servizio" />}
        />
      </div>
    </>
  )
}
