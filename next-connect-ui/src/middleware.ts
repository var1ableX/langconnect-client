import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const getUserResult = await supabase.auth.getUser()
  const { user } = getUserResult.data

  // Public paths that don't require authentication
  const publicPaths = ['/signin', '/signup', '/forgot-password', '/reset-password']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

  console.log("============================================")
  console.log("[MIDDLEWARE] Path:", request.nextUrl.pathname)
  console.log("[MIDDLEWARE] isPublicPath:", isPublicPath)
  console.log("[MIDDLEWARE] getUser() result:", {
    hasUser: !!user,
    hasError: !!getUserResult.error,
    error: getUserResult.error?.message
  })
  console.log("[MIDDLEWARE] User:", user ? `${user.email} (${user.id})` : "NULL")
  console.log("============================================")

  // If no user and trying to access protected route, redirect to signin
  if (!user && !isPublicPath) {
    console.log("[MIDDLEWARE] ❌ NO USER - Redirecting to /signin")
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }

  // If user is authenticated and trying to access auth pages, redirect to home
  if (user && isPublicPath) {
    console.log("[MIDDLEWARE] ✅ User authenticated on auth page - Redirecting to /")
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (user) {
    console.log("[MIDDLEWARE] ✅ User authenticated - Allowing access")
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
