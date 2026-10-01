import { type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response = NextResponse.next({ request })
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const redirectWithCookies = (pathname: string) => {
    const url = request.nextUrl.clone()
    url.pathname = pathname
    const redirectResponse = NextResponse.redirect(url)

    for (const cookie of response.cookies.getAll()) {
      redirectResponse.cookies.set(cookie)
    }

    return redirectResponse
  }

  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims ?? null
  const pathname = request.nextUrl.pathname
  const publicPath = pathname === '/login' || pathname === '/register' || pathname.startsWith('/auth/')

  if (!claims && !publicPath) {
    return redirectWithCookies('/login')
  }

  if (claims && (pathname === '/login' || pathname === '/register')) {
    return redirectWithCookies('/')
  }

  if (claims && !publicPath && pathname !== '/onboarding') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('location_point')
      .eq('id', claims.sub)
      .maybeSingle()

    if (!profile?.location_point) {
      return redirectWithCookies('/onboarding')
    }
  }

  if (claims && pathname === '/onboarding') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('location_point')
      .eq('id', claims.sub)
      .maybeSingle()

    if (profile?.location_point) {
      return redirectWithCookies('/')
    }
  }

  return response
}
