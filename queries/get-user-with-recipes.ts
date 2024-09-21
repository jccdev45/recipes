import { Database } from "@/supabase/supabase-types"
import { SupabaseClient } from "@supabase/supabase-js"

export function getUserWithRecipes(
  client: SupabaseClient<Database>,
  userId: string
) {
  return client
    .from("profiles")
    .select(`*, recipes(*)`)
    .eq("id", userId)
    .single()
}
