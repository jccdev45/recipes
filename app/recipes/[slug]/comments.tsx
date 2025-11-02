"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getRecipeWithComments } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/client"
import {
  useDeleteMutation,
  useInsertMutation,
  useQuery,
} from "@supabase-cache-helpers/postgrest-react-query"
import { UserCircle2 } from "lucide-react"
import { useForm } from "@tanstack/react-form"

import { cn } from "@/lib/utils"
import { CommentSchema } from "@/lib/zod/schema"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Typography } from "@/components/ui/typography"

import type { CommentInsert, Comment as CommentType } from "@/lib/types"
import type { User } from "@supabase/supabase-js"

type CommentsSectionProps = {
  className: string
  currentUser: User | null
  slug: string
}

export function CommentsSection({
  className,
  currentUser,
  slug,
}: CommentsSectionProps) {
  const supabase = createClient()
  const router = useRouter()

  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery(getRecipeWithComments(supabase, slug))

  if (!recipe) {
    return (
      <Typography variant="error">
        {error
          ? `There was an error displaying comments: ${error.message}`
          : "An unexpected error has occurred, try refreshing the page."}
      </Typography>
    )
  }

  const comments = recipe?.comments as unknown as CommentType[]

  // TODO: Fix
  if (isLoading) return <div>Loading comments...</div>
  if (error) return <div>Error loading comments: {error.message}</div>

  const { mutateAsync: insertCommentMutation } = useInsertMutation(
    supabase.from("comments"),
    ["id"],
    "*",
    {
      onSuccess: () => {
        router.refresh()
      },
    }
  )

  const { mutate: deleteCommentMutation } = useDeleteMutation(
    supabase.from("comments"),
    ["id"],
    "*",
    {
      onSuccess: () => {
        router.refresh()
      },
    }
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
        console.error("No user logged in")
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

      await insertCommentMutation([newComment])
      form.reset()
    },
  })

  return (
    <div className={cn("space-y-4", className)}>
      {currentUser ? (
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit()
          }}
        >
          <FieldSet className="gap-4">
            <form.Field
              name="message"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Leave a comment</FieldLabel>
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
                        placeholder={
                          currentUser
                            ? "Wow great recipe!"
                            : "You must be signed in to comment"
                        }
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
            <Button
              type="submit"
              disabled={
                !currentUser || !form.state.canSubmit || form.state.isSubmitting
              }
            >
              Submit
            </Button>
          </FieldSet>
        </form>
      ) : (
        <Typography variant="p">Please login to leave a comment</Typography>
      )}

      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUser={currentUser}
          onDelete={() => deleteCommentMutation({ id: comment.id })}
        />
      ))}
    </div>
  )
}

type CommentProps = {
  comment: CommentType
  currentUser: User | null
  onDelete: () => void
}

function CommentItem({ comment, currentUser, onDelete }: CommentProps) {
  const {
    author,
    avatar_url,
    created_at,
    id,
    liked_by,
    likes,
    message,
    user_id,
  } = comment
  const [liked, setLiked] = useState(likes)
  const supabase = createClient()

  // TODO: EXTRACT + COMPLETE FUNCTIONALITY
  const handleLike = async () => {
    if (liked_by.includes(user_id)) {
      return
    } else {
      const { data, error } = await supabase
        .from("comments")
        .update({ likes: likes + 1, liked_by: [...liked_by, user_id] })
        .eq("id", id!)
        .select()

      if (data) {
        // setLiked(data?.[0].likes);
        console.log(data)
      }
    }
  }

  // TODO: EXTRACT
  // const handleDelete = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from("comments")
  //       .delete()
  //       .eq("id", id!)
  //       .select()

  //     if (data) {
  //       router.refresh()
  //     }
  //     if (error) {
  //     }
  //   } catch (error) {
  //     console.error("Error: ", error)
  //     return null
  //   }
  // }

  return (
    <div className="relative flex w-full rounded-md border border-foreground/40 bg-background p-2 shadow-md dark:bg-slate-900 md:w-1/2">
      <Avatar className="mr-2">
        <AvatarImage src={avatar_url || ``} />
        <AvatarFallback>
          <UserCircle2 />
        </AvatarFallback>
      </Avatar>

      <div className="m-0 flex w-full flex-col">
        <Link
          href={`/profile/${user_id}`}
          className="max-w-max gap-x-4 font-bold underline"
        >
          {author}
        </Link>
        <span className="max-w-max text-sm">
          {new Date(created_at).toLocaleDateString("en-US")}
        </span>
        <Typography variant="p">{message}</Typography>
      </div>

      {/* <div className="flex items-center justify-center h-10 ml-auto gap-x-2">
        <Heart
          color="red"
          className={cn(
            `active:animate-ping bg-linear-to-br bg-clip-text from-red-500 to-red-800 fill-red-400`,
            liked_by.includes(user_id) && `cursor-default`
          )}
          onClick={handleLike}
        />
        <span>{liked}</span>
      </div> */}

      {currentUser?.id === user_id && (
        <AlertDialog>
          <AlertDialogTrigger>
            <Badge variant="destructive" className="absolute bottom-2 right-2">
              Delete
            </Badge>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this comment?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90"
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
