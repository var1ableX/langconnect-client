import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// Get current user from Supabase
export async function getCurrentUser() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error("[auth-utils] Error getting user:", error.message)
      return null
    }
    
    return user
  } catch (error) {
    console.error("[auth-utils] Exception getting current user:", error)
    return null
  }
}

// Require authentication - redirect to signin if not authenticated
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  return user
}

// Require guest - redirect to home if already authenticated
export async function requireGuest() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/")
  }
}
