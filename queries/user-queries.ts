import { TypedSupabaseClient } from "@/supabase/client"

export function getUserWithRecipes(
  client: TypedSupabaseClient,
  userId: string
) {
  return client
    .from("profiles")
    .select(`*, recipes(*)`)
    .eq("id", userId)
    .single()
}
