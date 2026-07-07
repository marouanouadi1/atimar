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
import { createSportAction } from '@/app/dashboard/sport/actions'
import { toast } from 'sonner'

export function CreaSportDialog() {
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleClose(value: boolean) {
    setOpen(value)
    if (!value) {
      setNome('')
      setSlug('')
      setError(null)
    }
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await createSportAction(nome, slug)
      if (result.error) {
        setError(result.error)
        toast.error('Errore durante la creazione', { description: result.error })
      } else {
        handleClose(false)
        toast.success('Sport creato con successo')
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
          <DialogTitle>Nuovo sport</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nome_sport">Nome *</Label>
            <Input
              id="nome_sport"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Es. Calcio a 5"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, ''))}
              placeholder="es. calcio5"
            />
            <p className="text-xs text-muted-foreground">Identificatore stabile usato nel codice. Deve corrispondere a un id in SPORTS (es. padel, calcio5, beachvolley).</p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={!nome || !slug || isPending}>
              {isPending ? 'Salvataggio...' : 'Crea sport'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
