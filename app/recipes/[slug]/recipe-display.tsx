"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getRecipeWithComments } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { User } from "@supabase/supabase-js"

import { Recipe } from "@/lib/types"
import { resolveStorageImageUrl, shimmer, toBase64 } from "@/lib/utils"
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
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Typography } from "@/components/ui/typography"
import { ErrorDisplay } from "@/components/error/error-display"
import { Ingredients } from "@/app/recipes/[slug]/ingredients"
import { Steps } from "@/app/recipes/[slug]/steps"

interface RecipeHeroProps {
  recipe: Recipe
  user: User | null
  fallbackSlug: string
}

interface RecipeContentProps {
  recipe: Recipe
}

interface RecipeDisplayProps {
  slug: string
  user: User | null
}

const formatDisplayDate = (input?: string | null) => {
  if (!input) return null

  const parsed = new Date(input)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return {
    dateTime: parsed.toISOString(),
    label: parsed.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }
}

const RecipeHero = ({ recipe, user, fallbackSlug }: RecipeHeroProps) => {
  const isAuthor = user && recipe.user_id === user.id
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteFeedback, setDeleteFeedback] = useState<{
    kind: "info" | "error"
    message: string
  } | null>(null)
  const recipeLabel = recipe.recipe_name?.trim() || "this recipe"
  const resolvedImageUrl = resolveStorageImageUrl(recipe.img)
  const imageUrl =
    resolvedImageUrl ||
    `https://placehold.co/640x480.png?text=${encodeURIComponent(recipeLabel)}`

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

    return "We could not delete the recipe. Please try again."
  }

  const handleDelete = async () => {
    if (!recipe.id) {
      setDeleteFeedback({
        kind: "error",
        message:
          "Unable to delete this recipe because it is missing the required identifier.",
      })
      return
    }

    setIsDeleting(true)
    setDeleteFeedback({ kind: "info", message: "Deleting recipe..." })

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", recipe.id)

      if (error) {
        throw error
      }

      router.push("/recipes")
      router.refresh()
    } catch (error) {
      console.error("Error deleting recipe:", error)
      setDeleteFeedback({
        kind: "error",
        message: getFeedbackMessage(error),
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const createdAt = formatDisplayDate(recipe.created_at)
  const updatedAt = formatDisplayDate(recipe.last_updated)
  const authorDisplayName = recipe.author || "Unknown author"
  const authorHref = isAuthor
    ? "/profile"
    : recipe.user_id
      ? `/profile/${recipe.user_id}`
      : undefined

  return (
    <section className="from-background via-muted/30 to-muted relative overflow-hidden rounded-3xl border bg-linear-to-br shadow-xl">
      <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div className="order-2 flex flex-col gap-6 lg:order-1">
          <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
            {isAuthor ? (
              <Badge
                variant="outline"
                className="border-primary/60 bg-primary/10 text-primary rounded-full px-3 py-1"
              >
                Your recipe
              </Badge>
            ) : null}
            <span className="flex items-center gap-1.5">
              <span className="text-foreground font-medium">By</span>
              {authorHref ? (
                <Link
                  href={authorHref}
                  className="focus-visible:ring-ring font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {authorDisplayName}
                  {isAuthor ? " (You)" : ""}
                </Link>
              ) : (
                <span className="text-foreground font-medium">
                  {authorDisplayName}
                  {isAuthor ? " (You)" : ""}
                </span>
              )}
            </span>
            {createdAt ? (
              <time
                dateTime={createdAt.dateTime}
                className="flex items-center gap-1"
              >
                <span aria-hidden="true">•</span>
                Created {createdAt.label}
              </time>
            ) : null}
            {updatedAt &&
            (!createdAt || updatedAt.dateTime !== createdAt.dateTime) ? (
              <time
                dateTime={updatedAt.dateTime}
                className="flex items-center gap-1"
              >
                <span aria-hidden="true">•</span>
                Updated {updatedAt.label}
              </time>
            ) : null}
          </div>

          <div className="space-y-4">
            <Typography variant="h1" className="text-balance">
              {recipe.recipe_name}
            </Typography>
            {recipe.quote ? (
              <Typography
                variant="blockquote"
                className="text-muted-foreground text-lg leading-relaxed text-balance"
              >
                {recipe.quote}
              </Typography>
            ) : null}
          </div>

          {recipe.tags.length ? (
            <ul className="flex flex-wrap gap-2" aria-label="Recipe tags">
              {recipe.tags.map(({ id, tag }) => (
                <li key={id ?? tag}>
                  <Badge
                    className="rounded-full px-3 py-1 text-sm"
                    variant="secondary"
                  >
                    {tag}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full md:hidden"
            >
              <a href="#recipe-ingredients">Jump to ingredients</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full md:hidden"
            >
              <a href="#recipe-steps">Jump to steps</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              <a href="#recipe-comments">View comments</a>
            </Button>
            {isAuthor ? (
              <Button asChild size="sm" className="rounded-full">
                <Link href={`/recipes/${recipe.slug ?? fallbackSlug}/edit`}>
                  Edit recipe
                </Link>
              </Button>
            ) : null}
            {isAuthor ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="rounded-full"
                    disabled={isDeleting}
                  >
                    Delete recipe
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this recipe?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove {recipeLabel} and any related
                      activity. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      disabled={isDeleting}
                      onClick={() => {
                        void handleDelete()
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/40"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}
          </div>
          {deleteFeedback ? (
            deleteFeedback.kind === "error" ? (
              <ErrorDisplay
                error={deleteFeedback.message}
                title="We couldn't delete this recipe"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                className="mt-3"
              />
            ) : (
              <Alert
                variant="default"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="mt-3"
              >
                <AlertDescription>{deleteFeedback.message}</AlertDescription>
              </Alert>
            )
          ) : null}
        </div>

        <div className="order-1 lg:order-2">
          <div className="border-border/60 bg-background/80 relative mx-auto max-w-[480px] overflow-hidden rounded-3xl border shadow-2xl">
            <AspectRatio ratio={4 / 3}>
              <Image
                src={imageUrl}
                alt={recipe.recipe_name || "Recipe presentation"}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 420px, (min-width: 640px) 80vw, 100vw"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(640, 480))}`}
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  )
}

const RecipeContent = ({ recipe }: RecipeContentProps) => (
  <section
    aria-labelledby="recipe-overview-heading"
    className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]"
  >
    <h2 id="recipe-overview-heading" className="sr-only">
      Recipe overview
    </h2>
    <Ingredients ingredients={recipe.ingredients} className="h-full" />
    <Steps steps={recipe.steps} className="h-full" />
  </section>
)

export function RecipeDisplay({ slug, user }: RecipeDisplayProps) {
  const supabase = createClient()
  const { data, isLoading, error } = useQuery(
    getRecipeWithComments(supabase, slug)
  )
  const recipe = useMemo(() => data as unknown as Recipe, [data])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4">
        <ErrorDisplay
          error={error.message}
          title="We couldn't load this recipe"
          role="alert"
        />
      </div>
    )
  }

  if (!recipe) {
    return null
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
      <RecipeHero recipe={recipe} user={user} fallbackSlug={slug} />
      <RecipeContent recipe={recipe} />
      <Separator className="mx-auto w-full max-w-5xl" />
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
    <section className="bg-card relative overflow-hidden rounded-3xl border shadow-xl">
      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div className="order-2 flex flex-col gap-6 lg:order-1">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4 max-w-[340px]" />
            <Skeleton className="h-16 w-full max-w-[460px]" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={`tag-skeleton-${index}`}
                className="h-6 w-20 rounded-full"
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={`cta-skeleton-${index}`}
                className="h-9 w-36 rounded-full"
              />
            ))}
          </div>
        </div>
        <div className="order-1 flex justify-center lg:order-2">
          <Skeleton className="h-[260px] w-full max-w-[460px] rounded-3xl" />
        </div>
      </div>
    </section>

    <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
      <section className="bg-card rounded-2xl border p-6 shadow">
        <Skeleton className="h-9 w-32" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </section>
      <section className="bg-card rounded-2xl border p-6 shadow">
        <Skeleton className="h-9 w-28" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={`step-${index}`}
              className="h-20 w-full rounded-xl"
            />
          ))}
        </div>
      </section>
    </div>
  </div>
)
