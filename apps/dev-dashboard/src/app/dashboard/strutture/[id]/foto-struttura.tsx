'use client'

import { uploadFotoStruttura } from '@atimar/api'
import { addFotoAction, deleteFotoAction, setCopertinaAction } from '../actions'
import { FotoManager, type FotoItem } from '@/components/custom/foto-manager'

type Props = {
  strutturaId: number
  foto: FotoItem[]
}

export function FotoStruttura({ strutturaId, foto }: Props) {
  return (
    <FotoManager
      foto={foto}
      onUpload={async (file, ordine, copertina) => {
        const { url, error } = await uploadFotoStruttura(strutturaId, file)
        if (error || !url) return { error: error?.message ?? 'Upload non riuscito' }
        return addFotoAction(strutturaId, url, ordine, copertina)
      }}
      onDelete={(fotoId) => deleteFotoAction(fotoId, strutturaId)}
      onSetCopertina={(fotoId) => setCopertinaAction(fotoId, strutturaId)}
    />
  )
}
