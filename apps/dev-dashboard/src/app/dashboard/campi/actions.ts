'use server'

import { createCampo, updateCampo, deleteCampo, addSportACampo, removeSportDaCampo, getSportByCampo, createFotoCampo, deleteFotoCampo, setCopertinaFotoCampo } from '@atimar/api'
import type { Database } from '@atimar/db-types'
import { revalidatePath } from 'next/cache'

type CampoInsert = Database['public']['Tables']['Campi']['Insert']
type CampoUpdate = Database['public']['Tables']['Campi']['Update']

function revalidateCampoFotoPaths(strutturaId?: number) {
  revalidatePath('/dashboard/campi')
  if (strutturaId) revalidatePath(`/dashboard/strutture/${strutturaId}`)
}

export async function createCampoAction(data: CampoInsert, sportIds: number[]) {
  const { data: campo, error } = await createCampo(data)
  if (error) return { error: error.message }

  for (const fkSport of sportIds) {
    const { error: sportError } = await addSportACampo({ fk_campo: campo!.id, fk_sport: fkSport })
    if (sportError) return { error: sportError.message }
  }

  revalidatePath('/dashboard/campi')
  return { error: null }
}

export async function deleteCampoAction(id: number) {
  const { error } = await deleteCampo(id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/campi')
  return { error: null }
}

export async function updateCampoAction(id: number, data: CampoUpdate, sportIds: number[]) {
  const { error } = await updateCampo(id, data)
  if (error) return { error: error.message }

  const { data: existing } = await getSportByCampo(id)
  const existingIds = (existing ?? []).map((s) => s.fk_sport)

  const toAdd = sportIds.filter((s) => !existingIds.includes(s))
  const toRemove = existingIds.filter((s) => !sportIds.includes(s))

  for (const fkSport of toAdd) {
    const { error: e } = await addSportACampo({ fk_campo: id, fk_sport: fkSport })
    if (e) return { error: e.message }
  }
  for (const fkSport of toRemove) {
    const { error: e } = await removeSportDaCampo(id, fkSport)
    if (e) return { error: e.message }
  }

  revalidatePath('/dashboard/campi')
  return { error: null }
}

export async function addFotoCampoAction(campoId: number, url: string, ordine: number, copertina: boolean, strutturaId?: number) {
  const { error } = await createFotoCampo({ fk_campo: campoId, url_foto: url, ordine, copertina })
  if (error) return { error: error.message }
  revalidateCampoFotoPaths(strutturaId)
  return { error: null }
}

export async function deleteFotoCampoAction(fotoId: number, strutturaId?: number) {
  const { error } = await deleteFotoCampo(fotoId)
  if (error) return { error: error.message }
  revalidateCampoFotoPaths(strutturaId)
  return { error: null }
}

export async function setCopertinaCampoAction(fotoId: number, campoId: number, strutturaId?: number) {
  const { error } = await setCopertinaFotoCampo(fotoId, campoId)
  if (error) return { error: error.message }
  revalidateCampoFotoPaths(strutturaId)
  return { error: null }
}
