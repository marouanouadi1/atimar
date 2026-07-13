'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MultiStepDialog } from '@/components/custom/multistep-dialog'
import { updateStrutturaAction } from '@/app/dashboard/strutture/actions'
import { toast } from 'sonner'
import { Pencil } from 'lucide-react'

type Citta = { id: number; nome: string | null }

type Struttura = {
  id: number
  nome: string
  email: string | null
  fk_citta: number
  indirizzo: string
  latitudine: number
  longitudine: number
  prezzo_orario: number | null
  telefono: string | null
  cellulare: string | null
  link_sito_web: string | null
  link_prenotazione_esterno: string | null
  descrizione: string | null
  attivo: boolean
  sempre_aperto: boolean
  verificata: boolean
  aperto_al_pubblico: boolean
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}

function Checkbox({ id, label, checked, onChange }: {
  id: string
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}

type FormState = {
  nome: string
  email: string
  fk_citta: string
  indirizzo: string
  latitudine: string
  longitudine: string
  prezzo_orario: string
  telefono: string
  cellulare: string
  link_sito_web: string
  link_prenotazione_esterno: string
  descrizione: string
  attivo: boolean
  sempre_aperto: boolean
  verificata: boolean
  aperto_al_pubblico: boolean
}

function strutturaToForm(s: Struttura): FormState {
  return {
    nome: s.nome,
    email: s.email ?? '',
    fk_citta: String(s.fk_citta),
    indirizzo: s.indirizzo,
    latitudine: String(s.latitudine),
    longitudine: String(s.longitudine),
    prezzo_orario: s.prezzo_orario != null ? String(s.prezzo_orario) : '',
    telefono: s.telefono ?? '',
    cellulare: s.cellulare ?? '',
    link_sito_web: s.link_sito_web ?? '',
    link_prenotazione_esterno: s.link_prenotazione_esterno ?? '',
    descrizione: s.descrizione ?? '',
    attivo: s.attivo,
    sempre_aperto: s.sempre_aperto,
    verificata: s.verificata,
    aperto_al_pubblico: s.aperto_al_pubblico,
  }
}

export function ModificaStrutturaDialog({ struttura, citta }: { struttura: Struttura; citta: Citta[] }) {
  const [form, setForm] = useState<FormState>(strutturaToForm(struttura))
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleComplete() {
    return new Promise<void>((resolve) => {
      startTransition(async () => {
        const result = await updateStrutturaAction(struttura.id, {
          nome: form.nome,
          email: form.email || null,
          fk_citta: Number(form.fk_citta),
          indirizzo: form.indirizzo,
          latitudine: Number(form.latitudine),
          longitudine: Number(form.longitudine),
          prezzo_orario: form.prezzo_orario ? Number(form.prezzo_orario) : null,
          telefono: form.telefono || null,
          cellulare: form.cellulare || null,
          link_sito_web: form.link_sito_web || null,
          link_prenotazione_esterno: form.link_prenotazione_esterno || null,
          descrizione: form.descrizione || null,
          attivo: form.attivo,
          sempre_aperto: form.sempre_aperto,
          verificata: form.verificata,
          aperto_al_pubblico: form.aperto_al_pubblico,
        })
        if (result.error) {
          setError(result.error)
          toast.error('Errore durante la modifica', { description: result.error })
        } else {
          setError(null)
          toast.success('Struttura aggiornata con successo')
        }
        resolve()
      })
    })
  }

  const steps = [
    {
      title: 'Informazioni base',
      description: 'Nome, posizione e prezzo della struttura',
      content: (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field id="nome" label="Nome *">
              <Input id="nome" value={form.nome} onChange={(e) => set('nome', e.target.value)} required />
            </Field>
            <Field id="prezzo_orario" label="Prezzo orario (€)">
              <Input id="prezzo_orario" type="number" step="0.01" min="0" value={form.prezzo_orario} onChange={(e) => set('prezzo_orario', e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Città *</Label>
              <Select value={form.fk_citta} onValueChange={(v) => set('fk_citta', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona una città" />
                </SelectTrigger>
                <SelectContent>
                  {citta.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Field id="indirizzo" label="Indirizzo *">
              <Input id="indirizzo" value={form.indirizzo} onChange={(e) => set('indirizzo', e.target.value)} required />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field id="latitudine" label="Latitudine *">
              <Input id="latitudine" type="number" step="any" value={form.latitudine} onChange={(e) => set('latitudine', e.target.value)} required />
            </Field>
            <Field id="longitudine" label="Longitudine *">
              <Input id="longitudine" type="number" step="any" value={form.longitudine} onChange={(e) => set('longitudine', e.target.value)} required />
            </Field>
          </div>
        </div>
      ),
    },
    {
      title: 'Contatti',
      description: 'Recapiti e link della struttura',
      content: (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field id="email" label="Email">
              <Input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </Field>
            <Field id="telefono" label="Telefono">
              <Input id="telefono" type="tel" value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
            </Field>
          </div>
          <Field id="cellulare" label="Cellulare">
            <Input id="cellulare" type="tel" value={form.cellulare} onChange={(e) => set('cellulare', e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field id="link_sito_web" label="Sito web">
              <Input id="link_sito_web" type="url" placeholder="https://" value={form.link_sito_web} onChange={(e) => set('link_sito_web', e.target.value)} />
            </Field>
            <Field id="link_prenotazione_esterno" label="Link prenotazione esterno">
              <Input id="link_prenotazione_esterno" type="url" placeholder="https://" value={form.link_prenotazione_esterno} onChange={(e) => set('link_prenotazione_esterno', e.target.value)} />
            </Field>
          </div>
        </div>
      ),
    },
    {
      title: 'Dettagli',
      description: 'Descrizione e impostazioni della struttura',
      content: (
        <div className="flex flex-col gap-4">
          <Field id="descrizione" label="Descrizione">
            <textarea
              id="descrizione"
              rows={4}
              value={form.descrizione}
              onChange={(e) => set('descrizione', e.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </Field>
          <div className="flex flex-col gap-2">
            <Checkbox id="attivo" label="Attivo" checked={form.attivo} onChange={(v) => set('attivo', v)} />
            <Checkbox id="sempre_aperto" label="Sempre aperto" checked={form.sempre_aperto} onChange={(v) => set('sempre_aperto', v)} />
            <Checkbox id="verificata" label="Verificata" checked={form.verificata} onChange={(v) => set('verificata', v)} />
            <Checkbox id="aperto_al_pubblico" label="Aperto al pubblico" checked={form.aperto_al_pubblico} onChange={(v) => set('aperto_al_pubblico', v)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      ),
    },
  ]

  return (
    <MultiStepDialog
      trigger={<Button size="icon-sm" variant="outline"><Pencil className="w-4 h-4" /></Button>}
      steps={steps}
      onComplete={handleComplete}
      onClose={() => { setForm(strutturaToForm(struttura)); setError(null) }}
      isSubmitting={isPending}
      submitLabel="Salva modifiche"
    />
  )
}
