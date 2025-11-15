import { NextResponse } from "next/server"
import { createClient } from "@/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const [recipesResult, commentsResult, userResult] = await Promise.all([
    supabase.from("recipes").select(
      `
        author,
        created_at,
        id,
        img,
        ingredients,
        last_updated,
        quote,
        recipe_name,
        search_vector,
        slug,
        steps,
        tags,
        user_id
      `
    ),
    supabase.from("comments").select("recipe_id"),
    supabase.auth.getUser(),
  ])

  if (recipesResult.error) {
    return NextResponse.json(
      { error: recipesResult.error.message },
      { status: 500 }
    )
  }

  const user = userResult.data.user
  const commentCountMap = new Map<number, number>()
  const commentRows = commentsResult.error ? [] : (commentsResult.data ?? [])
  if (commentsResult.error) {
    console.error("recipes:comments", commentsResult.error)
  }

  commentRows.forEach(({ recipe_id }) => {
    if (typeof recipe_id !== "number") return
    commentCountMap.set(recipe_id, (commentCountMap.get(recipe_id) ?? 0) + 1)
  })

  let favoriteSet = new Set<number>()
  if (user) {
    const favoritesResult = await supabase
      .from("favorites")
      .select("recipe_id")
      .eq("user_id", user.id)

    if (favoritesResult.error) {
      return NextResponse.json(
        { error: favoritesResult.error.message },
        { status: 500 }
      )
    }

    favoriteSet = new Set(
      (favoritesResult.data ?? [])
        .map((row) => row.recipe_id)
        .filter((recipeId): recipeId is number => typeof recipeId === "number")
    )
  }

  const recipes = (recipesResult.data ?? []).map((recipe) => ({
    ...recipe,
    commentCount: commentCountMap.get(recipe.id) ?? 0,
    isFavorite: favoriteSet.has(recipe.id),
  }))

  return NextResponse.json({ recipes })
}
