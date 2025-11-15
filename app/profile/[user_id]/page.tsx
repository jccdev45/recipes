import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/supabase/server"

import { getUser } from "@/app/(auth)/actions"
import { UserProfile } from "@/app/profile/[user_id]/user-profile"

type Props = {
  params: Promise<{ user_id: string }>
}

export async function generateMetadata({
  params,
}: {
  params: { user_id: string }
}): Promise<Metadata> {
  const { user_id } = await params

  try {
    const supabase = await createClient()
    const { data: user } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("id", user_id)
      .single()

    const name = user?.first_name ?? user_id

    return {
      title: `${name}'s Profile`,
      description: `View ${name}'s profile and recipes on Family Recipes.`,
    }
  } catch (error) {
    console.error("Error fetching user data:", error)
    return {
      title: "User Profile",
      description: "View user profile on Family Recipes.",
    }
  }
}

export default async function ProfilePage(props: Props) {
  const params = await props.params

  const { user_id } = params

  const { user } = await getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 sm:px-6 lg:px-8">
      <UserProfile user_id={user_id} currentUser={user} />
    </main>
  )
}
