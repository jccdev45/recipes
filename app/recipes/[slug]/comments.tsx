"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getRecipeWithComments } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/client"
import {
  useDeleteMutation,
  useInsertMutation,
  useQuery,
} from "@supabase-cache-helpers/postgrest-react-query"
import { useForm } from "@tanstack/react-form"
import { MessageCircle } from "lucide-react"

import { cn, resolveStorageImageUrl } from "@/lib/utils"
import { CommentSchema } from "@/lib/zod/schema"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { Typography } from "@/components/ui/typography"
import { EmptyStateDisplay } from "@/components/empty-state-display"
import { UserAvatar } from "@/components/user-avatar"

import type {
  CommentInsert,
  Comment as CommentType,
  RecipeWithComments,
} from "@/lib/types"
import type { User } from "@supabase/supabase-js"

type CommentsSectionProps = {
  className: string
  currentUser: User | null
  slug: string
}

const COMMENT_SELECTION =
  "id, recipe_id, user_id, author, avatar_url, message, likes, liked_by, created_at"

const getFeedbackMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message
  }

  return "Something went wrong. Please try again."
}

export function CommentsSection({
  className,
  currentUser,
  slug,
}: CommentsSectionProps) {
  const supabase = createClient()
  const router = useRouter()
  const [commentsFeedback, setCommentsFeedback] = useState<{
    type: "info" | "success" | "error"
    message: string
  } | null>(null)
  const feedbackRegionRef = useRef<HTMLDivElement | null>(null)

  const { data, isLoading, error } = useQuery(
    getRecipeWithComments(supabase, slug)
  )

  const recipe = (data ?? null) as RecipeWithComments | null

  const { mutateAsync: insertCommentMutation } = useInsertMutation(
    supabase.from("comments"),
    ["id"],
    COMMENT_SELECTION
  )

  const { mutateAsync: deleteCommentMutation } = useDeleteMutation(
    supabase.from("comments"),
    ["id"],
    COMMENT_SELECTION
  )

  const form = useForm({
    defaultValues: {
      message: "",
    },
    validators: {
      onChange: CommentSchema,
      onSubmit: CommentSchema,
    },
    onSubmit: async ({ value }) => {
      if (!currentUser) {
        setCommentsFeedback({
          type: "error",
          message: "Please sign in before leaving a comment.",
        })
        return
      }

      if (!recipe?.id) {
        setCommentsFeedback({
          type: "error",
          message: "Recipe context is missing. Refresh and try again.",
        })
        return
      }

      const author = currentUser.user_metadata.first_name || currentUser.email
      const newComment: CommentInsert = {
        author: author.toString(),
        avatar_url: currentUser.user_metadata.avatar_url,
        message: value.message,
        liked_by: [],
        likes: 0,
        recipe_id: recipe.id,
        user_id: currentUser.id,
      }

      try {
        setCommentsFeedback({ type: "info", message: "Posting comment..." })
        await insertCommentMutation([newComment])
        router.refresh()
        setCommentsFeedback({ type: "success", message: "Comment posted." })
        form.reset()
      } catch (mutationError) {
        console.error("Error posting comment:", mutationError)
        setCommentsFeedback({
          type: "error",
          message: getFeedbackMessage(mutationError),
        })
      }
    },
  })

  if (isLoading) {
    return (
      <section
        className={cn(
          "border-border/60 bg-background/80 flex min-h-[200px] items-center justify-center rounded-xl border",
          className
        )}
        aria-label="Comments loading"
      >
        <Spinner size="lg" icon="pinwheel" />
        <span className="sr-only">Loading comments</span>
      </section>
    )
  }

  if (error) {
    return (
      <section
        className={cn(
          "border-destructive/40 bg-destructive/10 rounded-xl border p-6",
          className
        )}
      >
        <Typography variant="error">
          There was an error displaying comments: {error.message}
        </Typography>
      </section>
    )
  }

  if (!recipe) {
    return (
      <section
        className={cn(
          "border-border/60 bg-muted/20 rounded-xl border p-6",
          className
        )}
      >
        <Typography variant="error">
          An unexpected error has occurred, try refreshing the page.
        </Typography>
      </section>
    )
  }

  const comments = (recipe.comments ?? []) as CommentType[]
  const commentCount = comments.length
  const commentCountLabel =
    commentCount === 1 ? "1 comment" : `${commentCount} comments`

  const handleDeleteComment = async (commentId: CommentType["id"]) => {
    if (!commentId) {
      setCommentsFeedback({
        type: "error",
        message:
          "Unable to delete this comment because it is missing the required identifier.",
      })
      return
    }

    try {
      setCommentsFeedback({ type: "info", message: "Deleting comment..." })
      await deleteCommentMutation({ id: commentId })
      router.refresh()
      setCommentsFeedback({ type: "success", message: "Comment removed." })
    } catch (mutationError) {
      console.error("Error deleting comment:", mutationError)
      setCommentsFeedback({
        type: "error",
        message: getFeedbackMessage(mutationError),
      })
    }
  }

  return (
    <section
      className={cn("flex flex-col gap-6", className)}
      aria-label="Comments"
    >
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Typography variant="h2">Comments</Typography>
          <Typography variant="p">
            Share feedback, tips, or substitutions with the community.
          </Typography>
        </div>
        <span className="text-muted-foreground text-sm">
          {commentCountLabel}
        </span>
      </header>

      {commentsFeedback ? (
        <Alert
          ref={feedbackRegionRef}
          variant={
            commentsFeedback.type === "error" ? "destructive" : "default"
          }
          role={commentsFeedback.type === "error" ? "alert" : "status"}
          aria-live={commentsFeedback.type === "error" ? "assertive" : "polite"}
          aria-atomic="true"
          className="flex items-start justify-between gap-4"
        >
          <AlertDescription className="text-sm">
            {commentsFeedback.message}
          </AlertDescription>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={() => setCommentsFeedback(null)}
          >
            Dismiss
          </Button>
        </Alert>
      ) : null}

      {currentUser ? (
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit()
          }}
          className="border-border/60 bg-background/80 rounded-xl border p-4 shadow-sm"
        >
          <FieldSet className="gap-3">
            <form.Field
              name="message"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid} className="space-y-2">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-sm font-medium"
                    >
                      Leave a comment
                    </FieldLabel>
                    <FieldContent>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        disabled={!currentUser}
                        placeholder="Share your thoughts or substitutions"
                        rows={4}
                        aria-invalid={isInvalid}
                        aria-describedby={
                          isInvalid ? `${field.name}-error` : undefined
                        }
                      />
                      {isInvalid && (
                        <FieldError
                          id={`${field.name}-error`}
                          errors={field.state.meta.errors}
                        />
                      )}
                    </FieldContent>
                  </Field>
                )
              }}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  !currentUser ||
                  !form.state.canSubmit ||
                  form.state.isSubmitting
                }
              >
                {form.state.isSubmitting ? "Posting..." : "Submit"}
              </Button>
            </div>
          </FieldSet>
        </form>
      ) : (
        <Typography variant="p" className="text-muted-foreground text-sm">
          Please login to leave a comment.
        </Typography>
      )}

      <div className="relative">
        <ScrollArea className="h-[480px] pr-3">
          {commentCount ? (
            <ul className="space-y-4 pr-2">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUser={currentUser}
                  onDelete={() => handleDeleteComment(comment.id)}
                />
              ))}
            </ul>
          ) : (
            <EmptyStateDisplay
              className="border-border/70 bg-muted/20 text-muted-foreground rounded-lg border border-dashed px-6 py-12 text-center"
              icon={<MessageCircle className="h-6 w-6" aria-hidden="true" />}
              title="No comments yet"
              description={
                currentUser
                  ? "Be the first to share your thoughts."
                  : "Sign in to leave a comment and start the conversation."
              }
            />
          )}
        </ScrollArea>
      </div>
    </section>
  )
}

type CommentProps = {
  comment: CommentType
  currentUser: User | null
  onDelete: () => void
}

function CommentItem({ comment, currentUser, onDelete }: CommentProps) {
  const { author, avatar_url, created_at, message, user_id } = comment
  const resolvedAvatarUrl = resolveStorageImageUrl(avatar_url)
  const trimmedAuthor = author?.trim() ?? ""
  const isAuthorEmail = trimmedAuthor.includes("@")
  const nameSegments = isAuthorEmail
    ? []
    : trimmedAuthor
        .split(/\s+/)
        .map((segment) => segment.trim())
        .filter((segment) => segment.length > 0)

  const derivedFirstName = nameSegments[0]
  const derivedLastName =
    nameSegments.length > 1 ? nameSegments.slice(1).join(" ") : undefined

  const avatarEmail = isAuthorEmail ? trimmedAuthor : undefined

  const createdDate = new Date(created_at)
  const isoCreatedAt = Number.isNaN(createdDate.getTime())
    ? undefined
    : createdDate.toISOString()
  const formattedDate = isoCreatedAt
    ? createdDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Date unavailable"

  const authorHref = user_id ? `/profile/${user_id}` : undefined
  const canDelete = currentUser?.id === user_id

  return (
    <li>
      <article className="border-border/60 bg-card text-card-foreground flex gap-4 rounded-xl border p-4 shadow-sm transition-colors">
        <UserAvatar
          className="mt-1"
          size="md"
          firstName={derivedFirstName}
          lastName={derivedLastName}
          email={avatarEmail}
          src={resolvedAvatarUrl}
        />

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {authorHref ? (
              <Link
                href={authorHref}
                className="text-foreground hover:text-primary focus-visible:ring-ring font-semibold underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {author}
              </Link>
            ) : (
              <span className="text-foreground font-semibold">{author}</span>
            )}
            {isoCreatedAt ? (
              <time
                dateTime={isoCreatedAt}
                className="text-muted-foreground text-xs"
              >
                {formattedDate}
              </time>
            ) : null}
          </div>

          <Typography
            variant="p"
            className="text-foreground text-sm leading-relaxed not-first:mt-0"
          >
            {message}
          </Typography>

          {canDelete ? (
            <div className="flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive focus-visible:ring-destructive/40"
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete this comment?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs"
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : null}
        </div>
      </article>
    </li>
  )
}
