'use client'

import { useState, useTransition } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { updateServizioAction, deleteServizioAction } from './actions'
import { toast } from 'sonner'

type Servizio = {
  id: number
  nome_servizio: string
  descrizione: string | null
  attivo: boolean | null
}

export function ServizioRowActions({ servizio }: { servizio: Servizio }) {
  const [editOpen, setEditOpen] = useState(false)
  const [nome, setNome] = useState(servizio.nome_servizio)
  const [descrizione, setDescrizione] = useState(servizio.descrizione ?? '')
  const [attivo, setAttivo] = useState(servizio.attivo ?? true)
  const [isPending, startTransition] = useTransition()

  function handleUpdate() {
    startTransition(async () => {
      const result = await updateServizioAction(servizio.id, {
        nome_servizio: nome,
        descrizione: descrizione || null,
        attivo,
      })
      if (result.error) {
        toast.error('Errore durante la modifica', { description: result.error })
      } else {
        toast.success('Servizio aggiornato con successo')
        setEditOpen(false)
      }
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteServizioAction(servizio.id)
      if (result.error) {
        toast.error('Errore durante l\'eliminazione', { description: result.error })
      } else {
        toast.success('Servizio eliminato con successo')
      }
    })
  }

  return (
    <AlertDialog>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil className="w-4 h-4 mr-2" />
                Modifica
              </DropdownMenuItem>
            </DialogTrigger>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Elimina
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Modifica servizio</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nome_servizio_edit">Nome *</Label>
              <Input id="nome_servizio_edit" value={nome} onChange={(e) => setNome(e.target.value)} autoFocus />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="descrizione_servizio_edit">Descrizione</Label>
              <Input id="descrizione_servizio_edit" value={descrizione} onChange={(e) => setDescrizione(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <input id="attivo_edit" type="checkbox" checked={attivo} onChange={(e) => setAttivo(e.target.checked)} className="h-4 w-4" />
              <Label htmlFor="attivo_edit">Attivo</Label>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleUpdate} disabled={!nome || isPending}>
                {isPending ? 'Salvataggio...' : 'Salva modifiche'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminazione servizio</AlertDialogTitle>
          <AlertDialogDescription>
            Sei sicuro di voler eliminare <strong>{servizio.nome_servizio}</strong>? Questa azione non può essere annullata.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annulla</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'Eliminazione...' : 'Elimina'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
