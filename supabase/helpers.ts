import { Recipe } from "@/supabase/types"
import { SupabaseClient, type User } from "@supabase/supabase-js"
import {
  englishDataset,
  englishRecommendedTransformers,
  RegExpMatcher,
} from "obscenity"

interface QueryParams {
  filters?: { column: string; value: any }
  order?: {
    column: string
    options?: {
      ascending: boolean
    }
  }
  limit?: number
}

export interface GetAllOptions {
  db: string
  params?: QueryParams
  column?: string
}

export async function getAuthUser(
  supabase: SupabaseClient
): Promise<User | undefined | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getAll(
  options: GetAllOptions,
  supabase: SupabaseClient
  // TODO: add proper typing
): Promise<any[] | null> {
  const { db, column, params } = options

  try {
    let query = supabase.from(db).select(column && column)
    if (params) {
      if (params.filters) {
        query = query.eq(params.filters.column, params.filters.value)
      }
      if (params.order) {
        query = query.order(params.order.column, params.order.options)
      }
      if (params.limit) {
        query = query.limit(params.limit)
      }
    }
    const { data } = await query
    return data
  } catch (error) {
    console.error("Error: ", error)
    return null
  }
}
export async function getOne(
  supabase: SupabaseClient,
  db: string,
  params?: QueryParams
): Promise<any> {
  try {
    let query = supabase.from(db).select()
    if (params) {
      if (params.filters) {
        query = query.eq(params.filters.column, params.filters.value)
      }
    }
    const { data } = await query.single()
    return data
  } catch (error) {
    console.error("Error: ", error)
    return null
  }
}

export async function searchRecipes(
  supabase: SupabaseClient,
  searchTerm: string
): Promise<Recipe[] | null> {
  try {
    const { data } = await supabase
      .from("recipes")
      .select()
      .textSearch("search_vector", searchTerm)
    return data
  } catch (error) {
    console.error("Error: ", error)
    return null
  }
}

export function checkProfamity(formData: FormData) {
  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  })

  for (const pair of formData.entries()) {
    return matcher.hasMatch(pair[1].toString())
  }
}
