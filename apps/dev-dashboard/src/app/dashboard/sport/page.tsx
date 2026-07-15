import { Topbar } from '@/components/topbar'
import { getSport } from '@atimar/api'
import { CreaSportDialog } from '@/components/dialogs/crea-sport-dialog'
import { SportTable } from './sport-table'

export default async function SportPage() {
  const { data: sport, error } = await getSport()

  return (
    <>
      <Topbar title="Sport" />
      <div className="p-6">
        {error && (
          <p className="text-sm text-destructive mb-4">{error.message}</p>
        )}
        <SportTable
          data={sport ?? []}
          action={<CreaSportDialog key="crea-sport" />}
        />
      </div>
    </>
  )
}
