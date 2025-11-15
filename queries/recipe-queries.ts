import { TypedSupabaseClient } from "@/supabase/client"

import { Recipe } from "@/lib/types"

export type RecipeSearchResult = Pick<
  Recipe,
  "id" | "slug" | "recipe_name" | "author" | "quote" | "tags"
>

export const getRecipes = (client: TypedSupabaseClient) => {
  return client.from("recipes").select(`
      author,
      created_at,
      id,
      img,
      last_updated,
      recipe_name,
      quote,
      search_vector,
      tags,
      slug,
      steps,
      ingredients,
      user_id,
      comment_meta:comments(count)
    `)
}

export const getRecipeBySlug = (client: TypedSupabaseClient, slug: string) => {
  return client
    .from("recipes")
    .select(
      `
      author,
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

export const getRecipeMeta = (client: TypedSupabaseClient, slug: string) => {
  return client
    .from("recipes")
    .select("recipe_name")
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
      last_updated,
      quote,
      recipe_name,
      slug,
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

export const getLandingHighlights = async (client: TypedSupabaseClient) => {
  const [featuredResponse, statsResponse] = await Promise.all([
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
    client.rpc("get_recipes_landing_stats"),
  ])

  if (featuredResponse.error) {
    throw featuredResponse.error
  }

  if (statsResponse.error) {
    throw statsResponse.error
  }

  const recipes = featuredResponse.data ?? []

  const statsDataArray = statsResponse.data as
    | {
        total_recipes: number | null
        contributor_count: number | null
        tag_count: number | null
      }[]
    | null

  const statsData = statsDataArray?.[0]

  const totalRecipes = statsData?.total_recipes ?? recipes.length
  const contributorCount = statsData?.contributor_count ?? 0
  const tagCount = statsData?.tag_count ?? 0

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
      tags
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
