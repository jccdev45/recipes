import { TypedSupabaseClient } from "@/supabase/client"

export const getRecipes = (client: TypedSupabaseClient) => {
  return client.from("recipes").select("*")
}

export const getRecipeBySlug = (client: TypedSupabaseClient, slug: string) => {
  return client.from("recipes").select("*").eq("slug", slug).single()
}

export const getFeaturedRecipes = (client: TypedSupabaseClient) => {
  return client
    .from("recipes")
    .select("*")
    .order("id", { ascending: true })
    .limit(3)
}