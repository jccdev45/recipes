import { TypedSupabaseClient } from "@/supabase/client"

import { Recipe } from "@/lib/types"

export const getRecipes = (client: TypedSupabaseClient) => {
  return client.from("recipes").select(`
      author,
      id,
      img,
      recipe_name,
      quote,
      tags,
      slug,
      steps,
      ingredients
    `)
}

export const getRecipeWithComments = (
  client: TypedSupabaseClient,
  slug: string
) => {
  return client
    .from("recipes")
    .select(
      `
      author,
      id,
      img,
      ingredients,
      quote,
      recipe_name,
      steps,
      tags,
      user_id,
      comments (
        author,
        avatar_url,
        created_at,
        id,
        liked_by,
        likes,
        message,
        user_id,
        recipe_id
      )
      `
    )
    .eq("slug", slug)
    .single()
}

export const getFeaturedRecipes = (client: TypedSupabaseClient) => {
  return client
    .from("recipes")
    .select(
      `
      author,
      id,
      img,
      quote,
      recipe_name,
      slug,
      tags
    `
    )
    .order("id", { ascending: true })
    .limit(3)
    .returns<Recipe[]>()
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
