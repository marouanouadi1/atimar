'use client'

import { useState, useMemo, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MultiStepDialog } from '@/components/custom/multistep-dialog'
import { updateCampoAction } from '@/app/dashboard/campi/actions'
import { toast } from 'sonner'

type Struttura = { id: number; nome: string }
type Sport = { id: number; nome_sport: string }

type Campo = {
  id: number
  nome_campo: string
  fk_struttura: number
  tipo_superficie: string | null
  prezzo_orario: number | null
  min_giocatori: number | null
  max_giocatori: number | null
  attivo: boolean
  coperto: boolean | null
  sport_ids: number[]
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
  id: string; label: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}

function CopertoSelect({
  value,
  onChange,
}: {
  value: boolean | null
  onChange: (v: boolean | null) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>Coperto</Label>
      <Select
        value={value === null ? 'unknown' : value ? 'yes' : 'no'}
        onValueChange={(v) => onChange(v === 'unknown' ? null : v === 'yes')}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="unknown">Non so</SelectItem>
          <SelectItem value="yes">Sì</SelectItem>
          <SelectItem value="no">No</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

type FormState = {
  fk_struttura: string
  nome_campo: string
  tipo_superficie: string
  prezzo_orario: string
  min_giocatori: string
  max_giocatori: string
  attivo: boolean
  coperto: boolean | null
  sport_ids: number[]
}

export function ModificaCampoDialog({ campo, strutture, sport, trigger }: {
  campo: Campo
  strutture: Struttura[]
  sport: Sport[]
  trigger: React.ReactNode
}) {
  const [form, setForm] = useState<FormState>({
    fk_struttura: String(campo.fk_struttura),
    nome_campo: campo.nome_campo,
    tipo_superficie: campo.tipo_superficie ?? '',
    prezzo_orario: campo.prezzo_orario != null ? String(campo.prezzo_orario) : '',
    min_giocatori: campo.min_giocatori != null ? String(campo.min_giocatori) : '',
    max_giocatori: campo.max_giocatori != null ? String(campo.max_giocatori) : '',
    attivo: campo.attivo,
    coperto: campo.coperto,
    sport_ids: campo.sport_ids,
  })
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleComplete() {
    return new Promise<void>((resolve) => {
      startTransition(async () => {
        const result = await updateCampoAction(campo.id, {
          fk_struttura: Number(form.fk_struttura),
          nome_campo: form.nome_campo,
          tipo_superficie: form.tipo_superficie || null,
          prezzo_orario: form.prezzo_orario ? Number(form.prezzo_orario) : null,
          min_giocatori: form.min_giocatori ? Number(form.min_giocatori) : null,
          max_giocatori: form.max_giocatori ? Number(form.max_giocatori) : null,
          attivo: form.attivo,
          coperto: form.coperto,
        }, form.sport_ids)
        if (result.error) {
          setError(result.error)
          toast.error('Errore durante la modifica', { description: result.error })
        } else {
          setError(null)
          toast.success('Campo aggiornato con successo')
        }
        resolve()
      })
    })
  }

  const steps = useMemo(() => [
    {
      title: 'Informazioni base',
      description: 'Nome e struttura di appartenenza',
      content: (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Struttura *</Label>
              <Select value={form.fk_struttura} onValueChange={(v) => set('fk_struttura', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona una struttura" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {strutture.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Field id="nome_campo" label="Nome campo *">
              <Input id="nome_campo" value={form.nome_campo} onChange={(e) => set('nome_campo', e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field id="tipo_superficie" label="Tipo superficie">
              <Input id="tipo_superficie" value={form.tipo_superficie} onChange={(e) => set('tipo_superficie', e.target.value)} placeholder="Es. Erba sintetica" />
            </Field>
            <Field id="prezzo_orario" label="Prezzo orario (€)">
              <Input id="prezzo_orario" type="number" step="0.01" min="0" value={form.prezzo_orario} onChange={(e) => set('prezzo_orario', e.target.value)} />
            </Field>
          </div>
        </div>
      ),
    },
    {
      title: 'Dettagli',
      description: 'Giocatori, sport e impostazioni del campo',
      content: (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field id="min_giocatori" label="Min giocatori">
              <Input id="min_giocatori" type="number" min="1" value={form.min_giocatori} onChange={(e) => set('min_giocatori', e.target.value)} />
            </Field>
            <Field id="max_giocatori" label="Max giocatori">
              <Input id="max_giocatori" type="number" min="1" value={form.max_giocatori} onChange={(e) => set('max_giocatori', e.target.value)} />
            </Field>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Sport</Label>
            <div className="flex flex-wrap gap-2">
              {sport.map((s) => {
                const selected = form.sport_ids.includes(s.id)
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => set('sport_ids', selected ? form.sport_ids.filter((id) => id !== s.id) : [...form.sport_ids, s.id])}
                    className={`px-3 py-1 rounded-full border text-sm transition-colors ${selected ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-input hover:bg-muted'}`}
                  >
                    {s.nome_sport}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Checkbox id="attivo" label="Attivo" checked={form.attivo} onChange={(v) => set('attivo', v)} />
            <CopertoSelect value={form.coperto} onChange={(v) => set('coperto', v)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      ),
    },
  ], [form, sport, strutture, error])

  return (
    <MultiStepDialog
      trigger={trigger}
      steps={steps}
      onComplete={handleComplete}
      onClose={() => {
        setForm({
          fk_struttura: String(campo.fk_struttura),
          nome_campo: campo.nome_campo,
          tipo_superficie: campo.tipo_superficie ?? '',
          prezzo_orario: campo.prezzo_orario != null ? String(campo.prezzo_orario) : '',
          min_giocatori: campo.min_giocatori != null ? String(campo.min_giocatori) : '',
          max_giocatori: campo.max_giocatori != null ? String(campo.max_giocatori) : '',
          attivo: campo.attivo,
          coperto: campo.coperto,
          sport_ids: campo.sport_ids,
        })
        setError(null)
      }}
      isSubmitting={isPending}
      submitLabel="Salva modifiche"
    />
  )
}
