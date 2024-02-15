import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/supabase/server"

import { TypographyH1, TypographyP } from "@/components/ui/typography"

export default async function EditRecipePage() {
  const supabase = createClient(cookies())
  // const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <section>
      <TypographyH1>Profile</TypographyH1>
      <TypographyP>{user?.email}</TypographyP>
    </section>
  )
}
