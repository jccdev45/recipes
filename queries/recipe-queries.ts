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

export const searchRecipes = (
  client: TypedSupabaseClient,
  searchTerm: string
) => {
  return client.from("recipes").select().textSearch("search_vector", searchTerm)
}

export const getRecipesColumn = (
  client: TypedSupabaseClient,
  column: string
) => {
  return client.from("recipes").select(column)
}
