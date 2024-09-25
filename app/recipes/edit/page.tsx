import { redirect } from "next/navigation"

import { Typography } from "@/components/ui/typography"
import { getUser } from "@/app/(auth)/actions"

export default async function EditRecipePage() {
  const { user, error } = await getUser()

  if (error) {
    console.error(error)
    redirect(`/auth-error?message=${error.message}`)
  }

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
