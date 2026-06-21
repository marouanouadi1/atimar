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
import { updateSportAction, deleteSportAction } from './actions'
import { toast } from 'sonner'

export function SportRowActions({ id, nome }: { id: number; nome: string }) {
  const [editOpen, setEditOpen] = useState(false)
  const [nomeSport, setNomeSport] = useState(nome)
  const [isPending, startTransition] = useTransition()

  function handleUpdate() {
    startTransition(async () => {
      const result = await updateSportAction(id, nomeSport)
      if (result.error) {
        toast.error('Errore durante la modifica', { description: result.error })
      } else {
        toast.success('Sport aggiornato con successo')
        setEditOpen(false)
      }
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteSportAction(id)
      if (result.error) {
        toast.error('Errore durante l\'eliminazione', { description: result.error })
      } else {
        toast.success('Sport eliminato con successo')
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
            <DialogTitle>Modifica sport</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nome_sport_edit">Nome *</Label>
              <Input
                id="nome_sport_edit"
                value={nomeSport}
                onChange={(e) => setNomeSport(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleUpdate} disabled={!nomeSport || isPending}>
                {isPending ? 'Salvataggio...' : 'Salva modifiche'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminazione sport</AlertDialogTitle>
          <AlertDialogDescription>
            Sei sicuro di voler eliminare <strong>{nome}</strong>? Questa azione non può essere annullata.
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
