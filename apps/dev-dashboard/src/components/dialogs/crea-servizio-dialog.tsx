'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createServizioAction } from '@/app/dashboard/servizi/actions'
import { toast } from 'sonner'

export function CreaServizioDialog() {
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState('')
  const [descrizione, setDescrizione] = useState('')
  const [attivo, setAttivo] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleClose(value: boolean) {
    setOpen(value)
    if (!value) {
      setNome('')
      setDescrizione('')
      setAttivo(true)
      setError(null)
    }
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await createServizioAction({
        nome_servizio: nome,
        descrizione: descrizione || null,
        attivo,
      })
      if (result.error) {
        setError(result.error)
        toast.error('Errore durante la creazione', { description: result.error })
      } else {
        handleClose(false)
        toast.success('Servizio creato con successo')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button size="sm">+ Aggiungi</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Nuovo servizio</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nome_servizio">Nome *</Label>
            <Input
              id="nome_servizio"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Es. Parcheggio"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="descrizione_servizio">Descrizione</Label>
            <Input
              id="descrizione_servizio"
              value={descrizione}
              onChange={(e) => setDescrizione(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="attivo_servizio"
              type="checkbox"
              checked={attivo}
              onChange={(e) => setAttivo(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="attivo_servizio">Attivo</Label>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={!nome || isPending}>
              {isPending ? 'Salvataggio...' : 'Crea servizio'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
