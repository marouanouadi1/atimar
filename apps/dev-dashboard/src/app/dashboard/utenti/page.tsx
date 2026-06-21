import { Topbar } from '@/components/topbar'
import { getProfili } from '@atimar/api'
import { UtentiTable } from './utenti-table'

export default async function UtentiPage() {
  const { data: profili, error } = await getProfili()

  return (
    <>
      <Topbar title="Utenti" />
      <div className="p-6">
        {error && (
          <p className="text-sm text-destructive mb-4">{error.message}</p>
        )}
        <UtentiTable data={profili ?? []} />
      </div>
    </>
  )
}
