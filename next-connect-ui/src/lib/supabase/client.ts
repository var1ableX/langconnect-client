import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Only use custom cookie handlers in browser
  if (typeof window === 'undefined') {
    throw new Error('createClient should only be called in browser')
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
  )
}
