import { TypedSupabaseClient } from "@/supabase/client"

import { CommentInsert } from "@/lib/types"

export const getCommentsByRecipeId = (
  client: TypedSupabaseClient,
  recipeId: number
) => {
  return client
    .from("comments")
    .select("*")
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: false })
}

export function insertComment(
  client: TypedSupabaseClient,
  newComment: CommentInsert
) {
  return client.from("comments").insert(newComment).select().single()
}

export function deleteComment(client: TypedSupabaseClient, commentId: number) {
  return client.from("comments").delete().eq("id", commentId).select()
}
