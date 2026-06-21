'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { aggiungiServizioAction, creaEAggiungiServizioAction } from '@/app/dashboard/strutture/actions'
import { toast } from 'sonner'

type Servizio = { id: number; nome_servizio: string }

type Mode = null | 'nuovo' | 'esistente'

export function AggiungiServizioDialog({ strutturaId, servizi }: { strutturaId: number; servizi: Servizio[] }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // stato nuovo servizio
  const [nome, setNome] = useState('')
  const [descrizione, setDescrizione] = useState('')
  const [attivo, setAttivo] = useState(true)

  // stato servizio esistente
  const [servizioId, setServizioId] = useState('')

  function handleClose(value: boolean) {
    setOpen(value)
    if (!value) {
      setMode(null)
      setError(null)
      setNome('')
      setDescrizione('')
      setServizioId('')
    }
  }

  function handleSubmit() {
    startTransition(async () => {
      let result: { error: string | null }

      if (mode === 'esistente') {
        result = await aggiungiServizioAction(strutturaId, Number(servizioId))
      } else {
        result = await creaEAggiungiServizioAction(strutturaId, { nome_servizio: nome, descrizione: descrizione || null, attivo })
      }

      if (result.error) {
        setError(result.error)
        toast.error('Errore durante l\'aggiunta', { description: result.error })
      } else {
        handleClose(false)
        toast.success('Servizio aggiunto con successo')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="outline"><Plus className="w-4 h-4" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Aggiungi servizio</DialogTitle>
        </DialogHeader>

        {mode === null && (
          <div className="flex flex-col gap-3 py-2">
            <Button variant="outline" className="h-16 flex flex-col gap-1" onClick={() => setMode('esistente')}>
              <span className="font-medium">Servizio esistente</span>
              <span className="text-xs text-muted-foreground">Collega un servizio già presente</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-1" onClick={() => setMode('nuovo')}>
              <span className="font-medium">Nuovo servizio</span>
              <span className="text-xs text-muted-foreground">Crea un nuovo servizio e collegalo</span>
            </Button>
          </div>
        )}

        {mode === 'esistente' && (
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label>Servizio</Label>
              <Select value={servizioId} onValueChange={setServizioId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona un servizio" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {servizi.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.nome_servizio}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setMode(null)}>Indietro</Button>
              <Button onClick={handleSubmit} disabled={!servizioId || isPending}>
                {isPending ? 'Salvataggio...' : 'Aggiungi'}
              </Button>
            </div>
          </div>
        )}

        {mode === 'nuovo' && (
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nome_servizio">Nome *</Label>
              <Input id="nome_servizio" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="descrizione_servizio">Descrizione</Label>
              <Input id="descrizione_servizio" value={descrizione} onChange={(e) => setDescrizione(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <input id="attivo_servizio" type="checkbox" checked={attivo} onChange={(e) => setAttivo(e.target.checked)} className="h-4 w-4" />
              <Label htmlFor="attivo_servizio">Attivo</Label>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setMode(null)}>Indietro</Button>
              <Button onClick={handleSubmit} disabled={!nome || isPending}>
                {isPending ? 'Salvataggio...' : 'Crea e aggiungi'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
