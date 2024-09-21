import { TypedSupabaseClient } from "@/supabase/client"

export function getRecipes(client: TypedSupabaseClient) {
  return client.from("recipes").select("*")
}
