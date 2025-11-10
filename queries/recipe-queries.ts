import { TypedSupabaseClient } from "@/supabase/client"

import { Recipe, Tag } from "@/lib/types"

export type RecipeSearchResult = Pick<
  Recipe,
  | "id"
  | "slug"
  | "recipe_name"
  | "author"
  | "quote"
  | "img"
  | "tags"
  | "created_at"
>

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

const DEFAULT_SEARCH_LIMIT = 8
export const MIN_SEARCH_QUERY_LENGTH = 2
const MIN_FTS_TERM_LENGTH = 3

export const sanitizeSearchTerm = (term: string) =>
  term
    .replace(/[\0-\x1F]+/g, " ")
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()

const buildPrefixTextSearchQuery = (term: string) => {
  const tokens = term
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0)

  if (tokens.length === 0) {
    return null
  }

  return tokens.map((token) => `${token}:*`).join(" & ")
}

const buildIlikePattern = (term: string) => {
  const escaped = term.replace(/[%_]/g, "\\$&")
  return `%${escaped.split(" ").join("%")}%`
}

export const searchRecipes = async (
  client: TypedSupabaseClient,
  rawSearchTerm: string,
  options?: {
    limit?: number
  }
) => {
  const limit = options?.limit ?? DEFAULT_SEARCH_LIMIT
  const searchTerm = sanitizeSearchTerm(rawSearchTerm)

  if (searchTerm.length < MIN_SEARCH_QUERY_LENGTH) {
    return [] as RecipeSearchResult[]
  }

  const selection = `
      id,
      slug,
      recipe_name,
      author,
      quote,
      img,
      tags,
      created_at
    `

  const results: RecipeSearchResult[] = []

  if (searchTerm.length >= MIN_FTS_TERM_LENGTH) {
    const prefixQuery = buildPrefixTextSearchQuery(searchTerm)

    if (prefixQuery) {
      const { data, error } = await client
        .from("recipes")
        .select(selection)
        .textSearch("search_vector", prefixQuery, {
          type: "plain",
          config: "english",
        })
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) {
        throw new Error(error.message)
      }

      if (data?.length) {
        results.push(...(data as RecipeSearchResult[]))
      }
    }
  }

  if (results.length < limit) {
    const pattern = buildIlikePattern(searchTerm)
    const fallbackColumns = [
      "recipe_name",
      "author",
      "tags::text",
      "ingredients::text",
    ] as const

    const existingIds = new Set(results.map((recipe) => recipe.id))

    for (const column of fallbackColumns) {
      if (results.length >= limit) {
        break
      }

      const { data: fallbackData, error: fallbackError } = await client
        .from("recipes")
        .select(selection)
        .filter(column, "ilike", pattern)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (fallbackError) {
        continue
      }

      if (!fallbackData?.length) {
        continue
      }

      for (const recipe of fallbackData as RecipeSearchResult[]) {
        if (existingIds.has(recipe.id)) {
          continue
        }

        results.push(recipe)
        existingIds.add(recipe.id)

        if (results.length >= limit) {
          break
        }
      }
    }
  }

  return results.slice(0, limit)
}

export const getRecipesColumn = (
  client: TypedSupabaseClient,
  column: string
) => {
  return client.from("recipes").select(column)
}
