import { getStrutturaById, getCampiByStruttura, getServiziByStruttura, getCittaById, getServizi, getFotoByStruttura, getSport } from '@atimar/api'
import { Topbar } from '@/components/topbar'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { ModificaStrutturaDialog } from '@/components/dialogs/modifica-struttura-dialog'
import { AggiungiServizioDialog } from '@/components/dialogs/aggiungi-servizio-dialog'
import { CreaCampoDialog } from '@/components/dialogs/crea-campo-dialog'
import { FotoCampoDialog } from '@/components/dialogs/foto-campo-dialog'
import { FotoStruttura } from './foto-struttura'

type Props = { params: Promise<{ id: string }> }

type FotoCampo = {
  id: number
  url_foto: string
  testo_alt: string | null
  ordine: number
  copertina: boolean
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm">{value ?? <span className="text-muted-foreground">—</span>}</span>
    </div>
  )
}


export default async function StrutturaDetailPage({ params }: Props) {
  const { id } = await params
  const strutturaId = Number(id)

  const [{ data: struttura }, { data: campi }, { data: servizi }, { data: tuttiServizi }, { data: foto }, { data: sport }] = await Promise.all([
    getStrutturaById(strutturaId),
    getCampiByStruttura(strutturaId),
    getServiziByStruttura(strutturaId),
    getServizi(),
    getFotoByStruttura(strutturaId),
    getSport(),
  ])

  if (!struttura) notFound()

  const { data: cittaStruttura } = await getCittaById(struttura.fk_citta)

  return (
    <>
      <Topbar title={struttura.nome} />
      <div className="p-6 flex flex-col gap-8">

        {/* Dati generali */}
        <Section title="Dati generali" action={<ModificaStrutturaDialog key="modifica-struttura" struttura={struttura} cittaSelezionata={cittaStruttura ?? null} />}>
          <div className="border rounded-xl p-6 flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">{struttura.nome}</h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-3 w-3">
                    {struttura.attivo && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />}
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${struttura.attivo ? 'bg-green-500' : 'bg-red-500'}`} />
                  </span>
                  <span className={`text-sm font-medium ${struttura.attivo ? 'text-green-600' : 'text-red-600'}`}>
                    {struttura.attivo ? 'Attivo' : 'Non attivo'}
                  </span>
                </span>
                {struttura.sempre_aperto && <Badge variant="outline">Sempre aperto</Badge>}
                {struttura.verificata && <Badge variant="outline">Verificata</Badge>}
                {struttura.aperto_al_pubblico && <Badge variant="outline">Aperto al pubblico</Badge>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <InfoField label="Città" value={cittaStruttura?.nome ?? '—'} />
              <InfoField label="Indirizzo" value={struttura.indirizzo} />
              <InfoField label="Posizione" value={struttura.posizione ? String(struttura.posizione) : null} />
              <InfoField label="Latitudine" value={struttura.latitudine} />
              <InfoField label="Longitudine" value={struttura.longitudine} />
              <InfoField label="Prezzo orario" value={struttura.prezzo_orario != null ? `€${struttura.prezzo_orario}` : null} />
              <InfoField label="Email" value={struttura.email} />
              <InfoField label="Telefono" value={struttura.telefono} />
              <InfoField label="Cellulare" value={struttura.cellulare} />
              <InfoField label="Sito web" value={struttura.link_sito_web} />
              <InfoField label="Link prenotazione" value={struttura.link_prenotazione_esterno} />
              <InfoField label="Sempre aperto" value={struttura.sempre_aperto ? 'Sì' : 'No'} />
              <InfoField label="Verificata" value={struttura.verificata ? 'Sì' : 'No'} />
              <InfoField label="Aperto al pubblico" value={struttura.aperto_al_pubblico ? 'Sì' : 'No'} />
              <InfoField label="Creata il" value={new Date(struttura.created_at).toLocaleDateString('it-IT')} />
              <InfoField label="Aggiornata il" value={new Date(struttura.aggiornato_il).toLocaleDateString('it-IT')} />
            </div>

            {struttura.descrizione && (
              <div className="border-t pt-4">
                <InfoField label="Descrizione" value={struttura.descrizione} />
              </div>
            )}
          </div>
        </Section>

        {/* Foto */}
        <Section title="Foto">
          <FotoStruttura strutturaId={strutturaId} foto={foto ?? []} />
        </Section>

        {/* Campi sportivi */}
        <Section title="Campi sportivi" action={
          <CreaCampoDialog
            key="crea-campo"
            strutture={[]}
            sport={sport ?? []}
            fixedStrutturaId={strutturaId}
            compact
          />
        }>
          {!campi?.length ? (
            <p className="text-sm text-muted-foreground">Nessun campo aggiunto.</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">Nome</th>
                    <th className="text-left px-4 py-2 font-medium">Superficie</th>
                    <th className="text-left px-4 py-2 font-medium">Giocatori</th>
                    <th className="text-left px-4 py-2 font-medium">Prezzo/ora</th>
                    <th className="text-left px-4 py-2 font-medium">Stato</th>
                    <th className="text-left px-4 py-2 font-medium">Foto</th>
                  </tr>
                </thead>
                <tbody>
                  {campi.map((c) => {
                    const fotoCampo = ((c as typeof c & { Foto_Campi?: FotoCampo[] | null }).Foto_Campi ?? [])
                    return (
                      <tr key={c.id} className="border-t">
                        <td className="px-4 py-2 font-medium">{c.nome_campo}</td>
                        <td className="px-4 py-2">{c.tipo_superficie ?? '—'}</td>
                        <td className="px-4 py-2">
                          {c.min_giocatori && c.max_giocatori
                            ? `${c.min_giocatori} – ${c.max_giocatori}`
                            : '—'}
                        </td>
                        <td className="px-4 py-2">
                          {c.prezzo_orario != null ? `€${c.prezzo_orario}` : '—'}
                        </td>
                        <td className="px-4 py-2">
                          <Badge className={c.attivo ? 'bg-green-500 text-white hover:bg-green-600' : ''} variant={c.attivo ? 'default' : 'secondary'}>
                            {c.attivo ? 'Attivo' : 'Inattivo'}
                          </Badge>
                        </td>
                        <td className="px-4 py-2">
                          <FotoCampoDialog
                            campoId={c.id}
                            campoNome={c.nome_campo}
                            strutturaId={strutturaId}
                            foto={fotoCampo}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        {/* Servizi */}
        <Section title="Servizi" action={<AggiungiServizioDialog key="aggiungi-servizio" strutturaId={strutturaId} servizi={tuttiServizi ?? []} />}>
          {!servizi?.length ? (
            <p className="text-sm text-muted-foreground">Nessun servizio aggiunto.</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">Nome</th>
                    <th className="text-left px-4 py-2 font-medium">Descrizione</th>
                    <th className="text-left px-4 py-2 font-medium">Stato</th>
                  </tr>
                </thead>
                <tbody>
                  {servizi.map((s) => {
                    const servizio = s.Servizi as { id: number; nome_servizio: string; descrizione: string | null; attivo: boolean | null } | null
                    if (!servizio) return null
                    return (
                      <tr key={s.fk_servizio} className="border-t">
                        <td className="px-4 py-2 font-medium">{servizio.nome_servizio}</td>
                        <td className="px-4 py-2 text-muted-foreground">{servizio.descrizione ?? '—'}</td>
                        <td className="px-4 py-2">
                          <Badge className={servizio.attivo ? 'bg-green-500 text-white hover:bg-green-600' : ''} variant={servizio.attivo ? 'default' : 'secondary'}>
                            {servizio.attivo ? 'Attivo' : 'Inattivo'}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Section>

      </div>
    </>
  )
}
