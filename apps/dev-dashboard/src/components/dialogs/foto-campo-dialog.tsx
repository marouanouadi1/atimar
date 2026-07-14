'use client'

import type { ReactNode } from 'react'
import { Images } from 'lucide-react'
import { uploadFotoCampo } from '@atimar/api'

import { FotoManager, type FotoItem } from '@/components/custom/foto-manager'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  addFotoCampoAction,
  deleteFotoCampoAction,
  setCopertinaCampoAction,
} from '@/app/dashboard/campi/actions'

type Props = {
  campoId: number
  campoNome: string
  foto: FotoItem[]
  strutturaId?: number
  trigger?: ReactNode
}

export function FotoCampoDialog({ campoId, campoNome, foto, strutturaId, trigger }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant="outline">
            <Images className="w-4 h-4" />
            {foto.length}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Foto campo</DialogTitle>
          <DialogDescription>{campoNome}</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto px-1 py-2">
          <FotoManager
            foto={foto}
            emptyText="Nessuna foto per questo campo. Clicca per aggiungere."
            onUpload={async (file, ordine, copertina) => {
              const { url, error } = await uploadFotoCampo(campoId, file)
              if (error || !url) return { error: error?.message ?? 'Upload non riuscito' }
              return addFotoCampoAction(campoId, url, ordine, copertina, strutturaId)
            }}
            onDelete={(fotoId) => deleteFotoCampoAction(fotoId, strutturaId)}
            onSetCopertina={(fotoId) => setCopertinaCampoAction(fotoId, campoId, strutturaId)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
