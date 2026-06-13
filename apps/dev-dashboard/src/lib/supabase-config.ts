const PLACEHOLDER_SUPABASE_HOST = 'placeholder.supabase.co'

type SupabaseConfig = {
  url: string
  anonKey: string
}

export function getSupabaseConfig(): SupabaseConfig {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!rawUrl || !anonKey) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in apps/dev-dashboard/.env.local.'
    )
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(rawUrl)
  } catch {
    throw new Error(
      'Invalid Supabase configuration. NEXT_PUBLIC_SUPABASE_URL must be a full URL like https://your-project.supabase.co.'
    )
  }

  if (parsedUrl.hostname === PLACEHOLDER_SUPABASE_HOST) {
    throw new Error(
      'Invalid Supabase configuration. NEXT_PUBLIC_SUPABASE_URL is still set to placeholder.supabase.co.'
    )
  }

  if (parsedUrl.pathname !== '/') {
    throw new Error(
      'Invalid Supabase configuration. NEXT_PUBLIC_SUPABASE_URL must be the project root URL, not a REST endpoint.'
    )
  }

  return {
    url: parsedUrl.origin,
    anonKey,
  }
}
