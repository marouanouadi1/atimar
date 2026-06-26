'use client'

import { useTransition } from 'react'
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
import { Images, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { ModificaCampoDialog } from '@/components/dialogs/modifica-campo-dialog'
import { FotoCampoDialog } from '@/components/dialogs/foto-campo-dialog'
import { deleteCampoAction } from './actions'
import { toast } from 'sonner'

type Struttura = { id: number; nome: string; }
type Sport = { id: number; nome_sport: string }
type Foto = {
  id: number
  url_foto: string
  testo_alt: string | null
  ordine: number
  copertina: boolean
}
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
  foto: Foto[]
}

export function CampoRowActions({ campo, strutture, sport }: {
  campo: Campo
  strutture: Struttura[]
  sport: Sport[]
}) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCampoAction(campo.id)
      if (result.error) {
        toast.error('Errore durante l\'eliminazione', { description: result.error })
      } else {
        toast.success('Campo eliminato con successo')
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
          <ModificaCampoDialog
            campo={campo}
            strutture={strutture}
            sport={sport}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil className="w-4 h-4 mr-2" />
                Modifica
              </DropdownMenuItem>
            }
          />
          <FotoCampoDialog
            campoId={campo.id}
            campoNome={campo.nome_campo}
            strutturaId={campo.fk_struttura}
            foto={campo.foto}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Images className="w-4 h-4 mr-2" />
                Foto
              </DropdownMenuItem>
            }
          />
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
          <AlertDialogTitle>Eliminazione campo</AlertDialogTitle>
          <AlertDialogDescription>
            Sei sicuro di voler eliminare <strong>{campo.nome_campo}</strong> appartenente alla struttura <strong>&apos;{strutture.find((s) => s.id === campo.fk_struttura)?.nome ?? '—'}&apos;</strong>? Questa azione non può essere annullata.
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
