'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
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
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react'
import { deleteStrutturaAction } from './actions'
import { toast } from 'sonner'

export function StrutturaRowActions({ id, nome }: { id: number; nome: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteStrutturaAction(id)
      if (result.error) {
        toast.error('Errore durante l\'eliminazione', { description: result.error })
      } else {
        toast.success('Struttura eliminata con successo')
      }
    })
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/dashboard/strutture/${id}`)}>
            <Eye className="w-4 h-4 mr-2" />
            Dettagli
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/dashboard/strutture/${id}`)}>
            <Pencil className="w-4 h-4 mr-2" />
            Modifica
          </DropdownMenuItem>
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

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminazione struttura</AlertDialogTitle>
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
