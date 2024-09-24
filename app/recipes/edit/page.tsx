import { redirect } from "next/navigation"
import { createClient } from "@/supabase/server"

import { Typography } from "@/components/ui/typography"

export default async function EditRecipePage() {
  const supabase = createClient()
  // const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <section>
      <Typography variant="h1">Profile</Typography>
      <Typography variant="p">{user?.email}</Typography>
    </section>
  )
}
