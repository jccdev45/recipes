import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getUserWithRecipes } from "@/queries/user-queries"
import { createClient } from "@/supabase/server"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"

import { GradientBanner } from "@/components/gradient-banner"
import { getUser } from "@/app/(auth)/actions"
import { UserProfile } from "@/app/profile/[user_id]/user-profile"

type Props = {
  params: { user_id: string }
}

export async function generateMetadata({
  params: { user_id },
}: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: user } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user_id)
    .single()

  return {
    title: `${user?.first_name ?? user_id}'s profile | recipes`,
  }
}

export default async function ProfilePage({ params: { user_id } }: Props) {
  const queryClient = new QueryClient()
  const supabase = createClient()
  const { user, error } = await getUser()

  if (error) {
    console.error(error)
    redirect(`/auth-error?message=${error.message}`)
  }

  await prefetchQuery(queryClient, getUserWithRecipes(supabase, user_id))

  return (
    <div className="mx-auto space-y-4">
      <GradientBanner pattern text="Profile" variant="secondary" />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserProfile user_id={user_id} currentUser={user} />
      </HydrationBoundary>
    </div>
  )
}
