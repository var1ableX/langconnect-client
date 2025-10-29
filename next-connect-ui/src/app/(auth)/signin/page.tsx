"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    console.log("============================================")
    console.log("[SIGNIN] STARTING SIGN IN PROCESS")
    console.log("[SIGNIN] Email:", email)
    console.log("[SIGNIN] Password length:", password.length)
    console.log("============================================")

    try {
      console.log("[SIGNIN] Calling supabase.auth.signInWithPassword...")
      
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("[SIGNIN] RESULT FROM SUPABASE:")
      console.log("[SIGNIN] - Has error:", !!result.error)
      console.log("[SIGNIN] - Error details:", result.error)
      console.log("[SIGNIN] - Has data:", !!result.data)
      console.log("[SIGNIN] - Has session:", !!result.data?.session)
      console.log("[SIGNIN] - Has user:", !!result.data?.user)
      console.log("[SIGNIN] - User email:", result.data?.user?.email)
      console.log("[SIGNIN] - Session access_token:", result.data?.session?.access_token ? "EXISTS" : "MISSING")

      if (result.error) {
        console.error("[SIGNIN] ❌ SIGN IN FAILED:", result.error.message)
        toast.error(result.error.message)
        return
      }

      console.log("[SIGNIN] ✅ SIGN IN SUCCESSFUL!")
      console.log("[SIGNIN] Checking cookies after sign in...")
      const allCookies = document.cookie.split(';').map(c => c.trim())
      console.log("[SIGNIN] Current cookies:", allCookies)
      const supabaseCookie = allCookies.find(c => c.includes('supabase'))
      console.log("[SIGNIN] Supabase cookie found:", !!supabaseCookie)
      
      toast.success("Signed in successfully!")
      
      console.log("[SIGNIN] Navigating to / and refreshing...")
      router.push("/")
      router.refresh()
    } catch (err) {
      console.error("[SIGNIN] ❌ EXCEPTION THROWN:", err)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
      console.log("[SIGNIN] Sign in process completed (loading=false)")
      console.log("============================================")
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background dark:bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 pb-2">
          <h1 className="text-2xl font-bold tracking-tight dark:text-gray-100">
            Sign In
          </h1>
          <p className="text-sm text-muted-foreground dark:text-gray-300">
            Enter your email and password to sign in
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium dark:text-gray-200"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium dark:text-gray-200"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-black dark:bg-white dark:text-black text-white hover:bg-black/90 dark:hover:bg-white/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="text-center text-sm dark:text-gray-300">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium underline dark:text-blue-400 hover:dark:text-blue-300"
            >
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
