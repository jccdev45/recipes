"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"

import { Button } from "@/components/ui/button"

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const signOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return <Button onClick={signOut}>Logout</Button>
}
