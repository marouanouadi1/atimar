'use server'

import { createCampo, updateCampo, deleteCampo, addSportACampo, removeSportDaCampo, getSportByCampo } from '@atimar/api'
import type { Database } from '@atimar/db-types'
import { revalidatePath } from 'next/cache'

type CampoInsert = Database['public']['Tables']['Campi']['Insert']
type CampoUpdate = Database['public']['Tables']['Campi']['Update']

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
