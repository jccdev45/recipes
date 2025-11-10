import { TypedSupabaseClient } from "@/supabase/client"

import { Recipe, Tag } from "@/lib/types"

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
      ingredients,
      user_id,
      created_at,
      last_updated
    `)
}

export const getRecipeBySlug = (client: TypedSupabaseClient, slug: string) => {
  return client
    .from("recipes")
    .select(
      `
      author,
      created_at,
      id,
      img,
      ingredients,
      last_updated,
      quote,
      recipe_name,
      slug,
      steps,
      tags,
      user_id
    `
    )
    .eq("slug", slug)
    .limit(1)
    .maybeSingle()
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
      created_at,
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
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
}

export interface LandingStats {
  totalRecipes: number
  featuredCount: number
  contributorCount: number
  tagCount: number
}

type RecipeMetadata = Pick<Recipe, "author" | "tags">

export const getLandingHighlights = async (client: TypedSupabaseClient) => {
  const [featuredResponse, totalResponse, metadataResponse] = await Promise.all(
    [
      client
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
        .order("created_at", { ascending: false })
        .limit(3)
        .returns<Recipe[]>(),
      client.from("recipes").select("id", { head: true, count: "exact" }),
      client.from("recipes").select("author, tags").returns<RecipeMetadata[]>(),
    ]
  )

  if (featuredResponse.error) throw featuredResponse.error
  if (totalResponse.error) throw totalResponse.error
  if (metadataResponse.error) throw metadataResponse.error

  const recipes = featuredResponse.data ?? []
  const totalRecipes = totalResponse.count ?? recipes.length

  const contributorCount = new Set(
    (metadataResponse.data ?? [])
      .map((entry) => entry.author?.trim())
      .filter((author): author is string => Boolean(author))
  ).size

  const tagCount = new Set(
    (metadataResponse.data ?? [])
      .flatMap((entry) => entry.tags ?? [])
      .map((tag: Tag) => tag.tag?.toLowerCase())
      .filter((tag): tag is string => Boolean(tag))
  ).size

  const stats: LandingStats = {
    totalRecipes,
    featuredCount: recipes.length,
    contributorCount,
    tagCount,
  }

  return { recipes, stats }
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
