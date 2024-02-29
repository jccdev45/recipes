"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"

import { Button } from "./ui/button"

export default function LogoutButton() {
  const router = useRouter()

  // Create a Supabase client configured to use cookies
  const supabase = createClient()

  const signOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <Button className="rounded-md px-4 py-2 no-underline" onClick={signOut}>
      Logout
    </Button>
  )
}
