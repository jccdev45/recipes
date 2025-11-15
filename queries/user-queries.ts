import { TypedSupabaseClient } from "@/supabase/client"

import { UserWithRecipes } from "@/lib/types"

export function getUserWithRecipes(
  client: TypedSupabaseClient,
  userId: string
) {
  return client
    .from("profiles")
    .select(
      `
        id,
        created_at,
        last_updated,
        first_name,
        last_name,
        avatar_url,
        user_id,
        recipes (
          author,
          id,
          img,
          quote,
          recipe_name,
          slug,
          tags,
          user_id
        )
      `
    )
    .eq("id", userId)
    .returns<UserWithRecipes[]>()
    .single()
}
