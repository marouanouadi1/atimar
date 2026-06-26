'use server'

import { createSport, updateSport, deleteSport } from '@atimar/api'
import { revalidatePath } from 'next/cache'

export async function createSportAction(nomeSport: string) {
  const { error } = await createSport({ nome_sport: nomeSport })
  if (error) return { error: error.message }
  revalidatePath('/dashboard/sport')
  return { error: null }
}

export async function updateSportAction(id: number, nomeSport: string) {
  const { error } = await updateSport(id, { nome_sport: nomeSport })
  if (error) return { error: error.message }
  revalidatePath('/dashboard/sport')
  return { error: null }
}

export async function deleteSportAction(id: number) {
  const { error } = await deleteSport(id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/sport')
  return { error: null }
}
