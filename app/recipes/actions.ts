"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/supabase/server"
import { z } from "zod"

import type { User } from "@supabase/supabase-js"

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

interface FavoriteActionResult {
  data?: {
    recipeId: number
    isFavorite: boolean
  }
  error?: string
}

const recipeIdSchema = z.coerce.number().int().positive()

function parseRecipeId(recipeId: unknown) {
  const result = recipeIdSchema.safeParse(recipeId)
  if (!result.success) {
    return { error: "Invalid recipe identifier." as const }
  }

  return { recipeId: result.data }
}

async function requireAuthenticatedClient(): Promise<
  { supabase: SupabaseServerClient; user: User } | { error: string }
> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error("favorites:getUser", error)
    return { error: "Unable to verify the current session." }
  }

  if (!user) {
    return { error: "You must be signed in to favorite recipes." }
  }

  return { supabase, user }
}

async function revalidateRecipeViews(
  supabase: SupabaseServerClient,
  recipeId: number
) {
  revalidatePath("/recipes")

  const { data } = await supabase
    .from("recipes")
    .select("slug")
    .eq("id", recipeId)
    .maybeSingle()

  if (data?.slug) {
    revalidatePath(`/recipes/${data.slug}`)
  }
}

export async function favoriteRecipe(
  recipeIdInput: unknown
): Promise<FavoriteActionResult> {
  const parsed = parseRecipeId(recipeIdInput)
  if ("error" in parsed) {
    return parsed
  }

  const authResult = await requireAuthenticatedClient()
  if ("error" in authResult) {
    return authResult
  }

  const { supabase, user } = authResult
  const { recipeId } = parsed

  const { error } = await supabase
    .from("favorites")
    .upsert(
      { user_id: user.id, recipe_id: recipeId },
      { onConflict: "user_id,recipe_id" }
    )

  if (error) {
    console.error("favorites:favoriteRecipe", error)
    return { error: "Unable to mark this recipe as a favorite right now." }
  }

  await revalidateRecipeViews(supabase, recipeId)

  return {
    data: {
      recipeId,
      isFavorite: true,
    },
  }
}

export async function unfavoriteRecipe(
  recipeIdInput: unknown
): Promise<FavoriteActionResult> {
  const parsed = parseRecipeId(recipeIdInput)
  if ("error" in parsed) {
    return parsed
  }

  const authResult = await requireAuthenticatedClient()
  if ("error" in authResult) {
    return authResult
  }

  const { supabase, user } = authResult
  const { recipeId } = parsed

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId)

  if (error) {
    console.error("favorites:unfavoriteRecipe", error)
    return { error: "Unable to remove this favorite right now." }
  }

  await revalidateRecipeViews(supabase, recipeId)

  return {
    data: {
      recipeId,
      isFavorite: false,
    },
  }
}

export async function toggleFavorite(
  recipeIdInput: unknown
): Promise<FavoriteActionResult> {
  const parsed = parseRecipeId(recipeIdInput)
  if ("error" in parsed) {
    return parsed
  }

  const authResult = await requireAuthenticatedClient()
  if ("error" in authResult) {
    return authResult
  }

  const { supabase, user } = authResult
  const { recipeId } = parsed

  const { data: existingFavorite, error: fetchError } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId)
    .maybeSingle()

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("favorites:toggleFavorite:fetch", fetchError)
    return { error: "Unable to check your favorites right now." }
  }

  if (existingFavorite) {
    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("recipe_id", recipeId)

    if (deleteError) {
      console.error("favorites:toggleFavorite:delete", deleteError)
      return { error: "Unable to update this favorite right now." }
    }

    await revalidateRecipeViews(supabase, recipeId)
    return {
      data: {
        recipeId,
        isFavorite: false,
      },
    }
  }

  const { error: insertError } = await supabase
    .from("favorites")
    .insert({ user_id: user.id, recipe_id: recipeId })

  if (insertError) {
    console.error("favorites:toggleFavorite:insert", insertError)
    return { error: "Unable to update this favorite right now." }
  }

  await revalidateRecipeViews(supabase, recipeId)
  return {
    data: {
      recipeId,
      isFavorite: true,
    },
  }
}
