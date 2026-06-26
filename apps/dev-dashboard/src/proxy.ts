import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getSupabaseConfig } from '@/lib/supabase-config'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isLogin = request.nextUrl.pathname === '/login'

  let supabaseConfig: ReturnType<typeof getSupabaseConfig>

  try {
    supabaseConfig = getSupabaseConfig()
  } catch (error) {
    console.error(error)
    return isDashboard
      ? NextResponse.redirect(new URL('/login', request.url))
      : response
  }

  const supabase = createServerClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let isAuthenticated = false

  try {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    isAuthenticated = Boolean(currentUser)
  } catch (error) {
    console.error(error)
  }

   if (!isAuthenticated && isDashboard) {
     return NextResponse.redirect(new URL('/login', request.url))
   }

   if (isAuthenticated && isLogin) {
     return NextResponse.redirect(new URL('/dashboard', request.url))
   }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico).*)'],
}
