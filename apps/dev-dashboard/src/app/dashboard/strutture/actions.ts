'use server'

import { createStruttura, updateStruttura, deleteStruttura, countCampiByStruttura, addServizioAStruttura, createServizio, createFoto, deleteFoto, setCopertinaFoto, searchCitta } from '@atimar/api'
import type { Database } from '@atimar/db-types'
import { revalidatePath } from 'next/cache'

type StrutturaInsert = Database['public']['Tables']['Strutture']['Insert']
type StrutturaUpdate = Database['public']['Tables']['Strutture']['Update']
type ServizioInsert = Database['public']['Tables']['Servizi']['Insert']

export async function createStrutturaAction(data: StrutturaInsert) {
  const { data: struttura, error } = await createStruttura(data)
  if (error) return { error: error.message, id: null }
  revalidatePath('/dashboard/strutture')
  return { error: null, id: struttura!.id }
}

export async function updateStrutturaAction(id: number, data: StrutturaUpdate) {
  const { error } = await updateStruttura(id, data)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/strutture')
  revalidatePath(`/dashboard/strutture/${id}`)
  return { error: null }
}

export async function deleteStrutturaAction(id: number) {
  const { count, error: countError } = await countCampiByStruttura(id)
  if (countError) return { error: countError.message, hasDatiCollegati: false }
  if (count && count > 0) return { error: null, hasDatiCollegati: true }

  const { error } = await deleteStruttura(id)
  if (error) {
    if (error.code === '23503') return { error: null, hasDatiCollegati: true }
    return { error: error.message, hasDatiCollegati: false }
  }
  revalidatePath('/dashboard/strutture')
  return { error: null, hasDatiCollegati: false }
}

export async function deleteStrutturaConCampiAction(id: number) {
  const { error } = await deleteStruttura(id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/strutture')
  return { error: null }
}

export async function aggiungiServizioAction(strutturaId: number, servizioId: number) {
  const { error } = await addServizioAStruttura({ fk_struttura: strutturaId, fk_servizio: servizioId })
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/strutture/${strutturaId}`)
  return { error: null }
}

export async function addFotoAction(strutturaId: number, url: string, ordine: number, copertina: boolean) {
  const { error } = await createFoto({ fk_struttura: strutturaId, url_foto: url, ordine, copertina })
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/strutture/${strutturaId}`)
  return { error: null }
}

export async function deleteFotoAction(fotoId: number, strutturaId: number) {
  const { error } = await deleteFoto(fotoId)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/strutture/${strutturaId}`)
  return { error: null }
}

export async function setCopertinaAction(fotoId: number, strutturaId: number) {
  const { error } = await setCopertinaFoto(fotoId, strutturaId)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/strutture/${strutturaId}`)
  return { error: null }
}

export async function searchCittaAction(query: string) {
  const { data, error } = await searchCitta(query)
  if (error) return []
  return (data ?? []).map((c) => ({ value: String(c.id), label: c.nome ?? '' }))
}

export async function creaEAggiungiServizioAction(strutturaId: number, data: Pick<ServizioInsert, 'nome_servizio' | 'descrizione' | 'attivo'>) {
  const { data: servizio, error: createError } = await createServizio(data)
  if (createError) return { error: createError.message }
  const { error } = await addServizioAStruttura({ fk_struttura: strutturaId, fk_servizio: servizio!.id })
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/strutture/${strutturaId}`)
  return { error: null }
}
