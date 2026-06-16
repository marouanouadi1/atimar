'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function loginAction(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  let error: { message: string } | null = null

  try {
    const supabase = await createServerSupabaseClient()
    const result = await supabase.auth.signInWithPassword({ email, password })
    error = result.error
  } catch (error) {
    console.error(error)
    return getLoginErrorMessage(error)
  }

  if (error) {
    return error.message
  }

  redirect('/dashboard')
}

function getLoginErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.includes('Supabase')) {
    return error.message
  }

  return 'Impossibile contattare Supabase. Verifica la configurazione e riprova.'
}
