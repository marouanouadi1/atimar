'use server'

import { createServizio, updateServizio, deleteServizio } from '@atimar/api'
import { revalidatePath } from 'next/cache'

export async function createServizioAction(data: { nome_servizio: string; descrizione: string | null; attivo: boolean }) {
  const { error } = await createServizio(data)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/servizi')
  return { error: null }
}

export async function updateServizioAction(id: number, data: { nome_servizio: string; descrizione: string | null; attivo: boolean }) {
  const { error } = await updateServizio(id, data)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/servizi')
  return { error: null }
}

export async function deleteServizioAction(id: number) {
  const { error } = await deleteServizio(id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/servizi')
  return { error: null }
}
