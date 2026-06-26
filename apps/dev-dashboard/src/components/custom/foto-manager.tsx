'use client'

import { useMemo, useRef, useTransition, type ChangeEvent } from 'react'
import Image from 'next/image'
import { ImageOff, MoreHorizontal, Plus, Star, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type FotoItem = {
  id: number
  url_foto: string
  testo_alt: string | null
  ordine: number
  copertina: boolean
}

type ActionResult = { error: string | null }

type Props = {
  foto: FotoItem[]
  onUpload: (file: File, ordine: number, copertina: boolean) => Promise<ActionResult>
  onDelete: (fotoId: number) => Promise<ActionResult>
  onSetCopertina: (fotoId: number) => Promise<ActionResult>
  emptyText?: string
  uploadSuccessText?: string
  deleteSuccessText?: string
  coverSuccessText?: string
}

export function FotoManager({
  foto,
  onUpload,
  onDelete,
  onSetCopertina,
  emptyText = 'Nessuna foto. Clicca per aggiungere.',
  uploadSuccessText = 'Foto caricate con successo',
  deleteSuccessText = 'Foto eliminata',
  coverSuccessText = 'Foto impostata come copertina',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const sortedFoto = useMemo(
    () => [...foto].sort((a, b) => a.ordine - b.ordine || a.id - b.id),
    [foto],
  )

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    startTransition(async () => {
      let uploaded = 0

      for (const [index, file] of files.entries()) {
        const result = await onUpload(file, foto.length + index + 1, foto.length === 0 && index === 0)
        if (result.error) {
          toast.error(`Errore upload ${file.name}`, { description: result.error })
          continue
        }
        uploaded += 1
      }

      if (uploaded > 0) toast.success(uploadSuccessText)
      if (inputRef.current) inputRef.current.value = ''
    })
  }

  function handleDelete(fotoId: number) {
    startTransition(async () => {
      const result = await onDelete(fotoId)
      if (result.error) {
        toast.error('Errore eliminazione foto', { description: result.error })
      } else {
        toast.success(deleteSuccessText)
      }
    })
  }

  function handleSetCopertina(fotoId: number) {
    startTransition(async () => {
      const result = await onSetCopertina(fotoId)
      if (result.error) {
        toast.error('Errore', { description: result.error })
      } else {
        toast.success(coverSuccessText)
      }
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUpload}
      />

      {sortedFoto.length === 0 ? (
        <button
          type="button"
          className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-12 cursor-pointer text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
        >
          <ImageOff className="w-8 h-8" />
          <span className="text-sm">{emptyText}</span>
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {sortedFoto.map((f) => (
            <AlertDialog key={f.id}>
              <div className="relative group rounded-lg overflow-hidden border aspect-video bg-muted">
                <Image
                  src={f.url_foto}
                  alt={f.testo_alt ?? ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {f.copertina && (
                  <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    Copertina
                  </span>
                )}
                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 bg-black/60 hover:bg-black/80 border-0 text-white"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!f.copertina && (
                        <DropdownMenuItem onClick={() => handleSetCopertina(f.id)}>
                          <Star className="w-4 h-4 mr-2" />
                          Copertina
                        </DropdownMenuItem>
                      )}
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onSelect={(event) => event.preventDefault()}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Elimina
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Elimina foto</AlertDialogTitle>
                  <AlertDialogDescription>
                    Sei sicuro di voler eliminare questa foto? Questa azione non puo essere annullata.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => handleDelete(f.id)}
                  >
                    Elimina
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ))}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className="aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs">Aggiungi</span>
          </button>
        </div>
      )}

      {isPending && (
        <p className="text-sm text-muted-foreground">Operazione in corso...</p>
      )}
    </div>
  )
}
