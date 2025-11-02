import { TypedSupabaseClient } from "@/supabase/client"

import { CommentInsert } from "@/lib/types"

export function insertComment(
  client: TypedSupabaseClient,
  newComment: CommentInsert
) {
  return client.from("comments").insert(newComment).select().single()
}

export function deleteComment(client: TypedSupabaseClient, commentId: string) {
  return client.from("comments").delete().eq("id", commentId).select()
}
