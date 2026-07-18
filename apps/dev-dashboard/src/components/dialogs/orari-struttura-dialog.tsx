'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Clock, Pencil, Plus, X } from 'lucide-react'
import { salvaOrariStrutturaAction } from '@/app/dashboard/strutture/actions'
import { toast } from 'sonner'
import type { Database } from '@atimar/db-types'

type OrarioRow = Database['public']['Tables']['Orari_Strutture']['Row']
type OrarioInsert = Database['public']['Tables']['Orari_Strutture']['Insert']

const GIORNI = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica']

type Fascia = { apertura: string; chiusura: string }
type GiornoState = { chiuso: boolean; fasce: Fascia[] }

function statoIniziale(orari: OrarioRow[]): GiornoState[] {
  return GIORNI.map((_, giorno) => {
    const righeGiorno = orari.filter((o) => o.giorno_settimana === giorno)
    if (!righeGiorno.length) return { chiuso: false, fasce: [] }
    if (righeGiorno.some((r) => r.chiuso)) return { chiuso: true, fasce: [] }
    return {
      chiuso: false,
      fasce: righeGiorno.map((r) => ({
        apertura: (r.orario_apertura ?? '').slice(0, 5),
        chiusura: (r.orario_chiusura ?? '').slice(0, 5),
      })),
    }
  })
}

export function OrariStrutturaDialog({ strutturaId, orari }: { strutturaId: number; orari: OrarioRow[] }) {
  const [open, setOpen] = useState(false)
  const [giorni, setGiorni] = useState<GiornoState[]>(() => statoIniziale(orari))
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleClose(value: boolean) {
    setOpen(value)
    if (!value) {
      setGiorni(statoIniziale(orari))
      setError(null)
    }
  }

  function setChiuso(giorno: number, chiuso: boolean) {
    setGiorni((prev) => prev.map((g, i) => (i === giorno ? { ...g, chiuso, fasce: chiuso ? [] : g.fasce } : g)))
  }

  function addFascia(giorno: number) {
    setGiorni((prev) =>
      prev.map((g, i) => (i === giorno ? { ...g, fasce: [...g.fasce, { apertura: '', chiusura: '' }] } : g)),
    )
  }

  function removeFascia(giorno: number, indiceFascia: number) {
    setGiorni((prev) =>
      prev.map((g, i) => (i === giorno ? { ...g, fasce: g.fasce.filter((_, fi) => fi !== indiceFascia) } : g)),
    )
  }

  function setFascia(giorno: number, indiceFascia: number, campo: keyof Fascia, valore: string) {
    setGiorni((prev) =>
      prev.map((g, i) =>
        i === giorno
          ? { ...g, fasce: g.fasce.map((f, fi) => (fi === indiceFascia ? { ...f, [campo]: valore } : f)) }
          : g,
      ),
    )
  }

  function handleSubmit() {
    setError(null)

    // Validazione: ogni fascia compilata deve avere apertura < chiusura.
    for (let giorno = 0; giorno < giorni.length; giorno++) {
      const g = giorni[giorno]
      if (g.chiuso) continue
      for (const f of g.fasce) {
        if (!f.apertura || !f.chiusura) {
          setError(`${GIORNI[giorno]}: completa apertura e chiusura di ogni fascia.`)
          return
        }
        if (f.apertura >= f.chiusura) {
          setError(`${GIORNI[giorno]}: l'orario di apertura deve precedere la chiusura.`)
          return
        }
      }
    }

    const payload: Omit<OrarioInsert, 'fk_struttura'>[] = []
    giorni.forEach((g, giorno) => {
      if (g.chiuso) {
        payload.push({ giorno_settimana: giorno, chiuso: true, orario_apertura: null, orario_chiusura: null })
        return
      }
      for (const f of g.fasce) {
        payload.push({
          giorno_settimana: giorno,
          chiuso: false,
          orario_apertura: f.apertura,
          orario_chiusura: f.chiusura,
        })
      }
    })

    startTransition(async () => {
      const result = await salvaOrariStrutturaAction(strutturaId, payload)
      if (result.error) {
        setError(result.error)
        toast.error('Errore durante il salvataggio', { description: result.error })
      } else {
        handleClose(false)
        toast.success('Orari aggiornati con successo')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="outline">
          {orari.length ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-4 h-4" /> Orari di apertura
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {giorni.map((g, giorno) => (
            <div key={giorno} className="border rounded-lg p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{GIORNI[giorno]}</span>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={g.chiuso}
                    onChange={(e) => setChiuso(giorno, e.target.checked)}
                  />
                  Chiuso
                </label>
              </div>

              {!g.chiuso && (
                <div className="flex flex-col gap-2">
                  {g.fasce.map((f, indiceFascia) => (
                    <div key={indiceFascia} className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={f.apertura}
                        onChange={(e) => setFascia(giorno, indiceFascia, 'apertura', e.target.value)}
                        className="w-32"
                      />
                      <span className="text-muted-foreground text-sm">–</span>
                      <Input
                        type="time"
                        value={f.chiusura}
                        onChange={(e) => setFascia(giorno, indiceFascia, 'chiusura', e.target.value)}
                        className="w-32"
                      />
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => removeFascia(giorno, indiceFascia)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="self-start" onClick={() => addFascia(giorno)}>
                    <Plus className="w-3.5 h-3.5" /> Aggiungi fascia
                  </Button>
                </div>
              )}
            </div>
          ))}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? 'Salvataggio...' : 'Salva orari'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
