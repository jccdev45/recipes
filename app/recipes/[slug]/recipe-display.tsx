"use client"

import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { getRecipeWithComments } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { User } from "@supabase/supabase-js"

import { Recipe } from "@/lib/types"
import { resolveStorageImageUrl, shimmer, toBase64 } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Typography } from "@/components/ui/typography"
import { Ingredients } from "@/app/recipes/[slug]/ingredients"
import { Steps } from "@/app/recipes/[slug]/steps"

interface RecipeHeaderProps {
  recipe: Recipe
  user: User | null
}

interface RecipeContentProps {
  recipe: Recipe
}

interface RecipeDisplayProps {
  slug: string
  user: User | null
}

const RecipeHeader = ({ recipe, user }: RecipeHeaderProps) => {
  const isAuthor = user && recipe.user_id === user.id
  const resolvedImageUrl = resolveStorageImageUrl(recipe.img)
  const imgUrl =
    resolvedImageUrl ||
    `https://placehold.co/450x325?text=${encodeURIComponent(recipe.recipe_name)}`

  return (
    <header className="bg-primary/30 grid grid-cols-1 gap-8 rounded-md py-8 md:grid-cols-2">
      <div className="my-auto grid h-fit place-items-center gap-4 text-center">
        <Typography variant="h1">{recipe.recipe_name}</Typography>
        <Typography variant="blockquote">{recipe.quote}</Typography>
        {isAuthor ? (
          <Link
            href="/profile"
            className="mb-4 inline-flex items-center text-lg underline"
          >
            - {recipe.author} (You)
          </Link>
        ) : (
          <Typography>- {recipe.author}</Typography>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          {recipe.tags.map(({ id, tag }) => (
            <Badge key={id}>{tag}</Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Image
          src={imgUrl}
          alt={recipe.recipe_name || "Generic fallback"}
          width={450}
          height={325}
          className="shadow-foreground aspect-square rounded-md object-cover shadow-sm"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(450, 325))}`}
        />
      </div>
    </header>
  )
}

const RecipeContent = ({ recipe }: RecipeContentProps) => (
  <div className="my-8 grid grid-cols-1 gap-8 md:grid-cols-2">
    <Ingredients ingredients={recipe.ingredients} className="flex flex-col" />
    <Steps steps={recipe.steps} className="flex flex-col" />
  </div>
)

export function RecipeDisplay({ slug, user }: RecipeDisplayProps) {
  const supabase = createClient()
  const { data, isLoading, error } = useQuery(
    getRecipeWithComments(supabase, slug)
  )
  const recipe = data as unknown as Recipe

  if (isLoading) {
    return (
      <div className="flex h-screen items-start justify-center">
        <Spinner size="xl" icon="pinwheel" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-destructive/20 flex flex-1 items-start justify-center rounded py-20">
        <Typography variant="error" className="text-2xl">
          An error occurred: {error.message}
        </Typography>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <Suspense fallback={<LoadingSkeleton />}>
        <RecipeHeader recipe={recipe} user={user} />
        <RecipeContent recipe={recipe} />
      </Suspense>
      <Separator />
    </div>
  )
}

const SVGSkeleton = ({ className }: { className: string }) => (
  <svg className={className + " animate-pulse rounded bg-gray-300"} />
)

const LoadingSkeleton = () => (
  <>
    <div className="container mx-auto px-4">
      <header className="grid grid-cols-1 gap-8 py-8 md:grid-cols-2">
        <div className="my-auto grid h-fit place-items-center gap-4">
          <h1 className="scroll-m-20 tracking-tight">
            <Skeleton className="w-[120px] max-w-full" />
          </h1>
          <blockquote className="mt-6 border-l-2 pl-6">
            <Skeleton className="w-32 max-w-full" />
          </blockquote>
          <p className="[&amp;:not(:first-child)]:mt-6 leading-7">
            <Skeleton className="w-16 max-w-full" />
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <div className="inline-flex items-center border border-transparent px-2.5 py-0.5 transition-colors">
              <Skeleton className="w-12 max-w-full" />
            </div>
            <div className="inline-flex items-center border border-transparent px-2.5 py-0.5 transition-colors">
              <Skeleton className="w-14 max-w-full" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <SVGSkeleton className="shadow-foreground aspect-square h-[325px] w-[450px] rounded-md object-cover shadow-sm" />
        </div>
      </header>
      <div className="my-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <section className="flex flex-col">
          <div className="flex items-center gap-4 border-b">
            <h2 className="scroll-m-20 border-0 pb-2 tracking-tight transition-colors first:mt-0">
              <Skeleton className="w-[88px] max-w-full" />
            </h2>
            <a>
              <SVGSkeleton className="h-6 w-6" />
            </a>
          </div>
          <span className="mx-auto flex w-2/3 items-center justify-center gap-x-4">
            <span className="flex items-center justify-center">
              <div className="border-input flex h-9 w-16 border px-3 py-1 shadow-xs transition-colors file:border-0"></div>
              <span>
                <div className="inline-flex h-9 w-9 items-center justify-center transition-colors">
                  <SVGSkeleton className="lucide-arrow-up h-6 w-6" />
                </div>
                <div className="inline-flex h-9 w-9 items-center justify-center transition-colors">
                  <SVGSkeleton className="lucide-arrow-down h-6 w-6" />
                </div>
              </span>
              <label className="leading-none">
                <Skeleton className="w-16 max-w-full" />
              </label>
            </span>
          </span>
          <ul className="[&amp;>li]:mt-2 my-6 md:ml-6">
            <li className="my-1 flex items-center justify-start gap-x-1">
              <div className="m-0 w-[12%]">
                <Skeleton className="w-3.5 max-w-full" />
              </div>
              <label className="border-border my-auto w-5/6 space-x-2 border-b">
                <span>
                  <Skeleton className="w-20 max-w-full" />
                </span>
                <span>
                  <Skeleton className="w-40 max-w-full" />
                </span>
              </label>
            </li>
            <li className="my-1 flex items-center justify-start gap-x-1">
              <div className="m-0 w-[12%]">
                <Skeleton className="w-3.5 max-w-full" />
              </div>
              <label className="border-border my-auto w-5/6 space-x-2 border-b">
                <span>
                  <Skeleton className="w-6 max-w-full" />
                </span>
                <span>
                  <Skeleton className="w-20 max-w-full" />
                </span>
              </label>
            </li>
            <li className="my-1 flex items-center justify-start gap-x-1">
              <div className="m-0 w-[12%]">
                <Skeleton className="w-3.5 max-w-full" />
              </div>
              <label className="border-border my-auto w-5/6 space-x-2 border-b">
                <span>
                  <Skeleton className="w-[88px] max-w-full" />
                </span>
                <span>
                  <Skeleton className="w-[88px] max-w-full" />
                </span>
              </label>
            </li>
            <li className="my-1 flex items-center justify-start gap-x-1">
              <div className="m-0 w-[12%]">
                <Skeleton className="w-3.5 max-w-full" />
              </div>
              <label className="border-border my-auto w-5/6 space-x-2 border-b">
                <span>
                  <Skeleton className="w-20 max-w-full" />
                </span>
                <span>
                  <Skeleton className="w-12 max-w-full" />
                </span>
              </label>
            </li>
            <li className="my-1 flex items-center justify-start gap-x-1">
              <div className="m-0 w-[12%]">
                <Skeleton className="w-3.5 max-w-full" />
              </div>
              <label className="border-border my-auto w-5/6 space-x-2 border-b">
                <span>
                  <Skeleton className="w-20 max-w-full" />
                </span>
                <span>
                  <Skeleton className="w-10 max-w-full" />
                </span>
              </label>
            </li>
            <li className="my-1 flex items-center justify-start gap-x-1">
              <div className="m-0 w-[12%]">
                <Skeleton className="w-3.5 max-w-full" />
              </div>
              <label className="border-border my-auto w-5/6 space-x-2 border-b">
                <span>
                  <Skeleton className="w-20 max-w-full" />
                </span>
                <span>
                  <Skeleton className="w-[264px] max-w-full" />
                </span>
              </label>
            </li>
          </ul>
        </section>
        <div className="flex flex-col">
          <h2 className="scroll-m-20 border-b pb-2 tracking-tight transition-colors first:mt-0">
            <Skeleton className="w-10 max-w-full" />
          </h2>
          <ul className="[&amp;>li]:mt-2 my-6 mt-4 flex flex-col space-y-2 md:ml-6">
            <li className="flex items-center space-x-2 p-2 transition-colors">
              <div className="border-primary m-0 h-4 w-4 shrink-0 border"></div>
              <label className="m-0">
                <Skeleton className="w-[552px] max-w-full" />
              </label>
            </li>
            <li className="flex items-center space-x-2 p-2 transition-colors">
              <div className="border-primary m-0 h-4 w-4 shrink-0 border"></div>
              <label className="m-0">
                <Skeleton className="w-[184px] max-w-full" />
              </label>
            </li>
            <li className="flex items-center space-x-2 p-2 transition-colors">
              <div className="border-primary m-0 h-4 w-4 shrink-0 border"></div>
              <label className="m-0">
                <Skeleton className="w-[488px] max-w-full" />
              </label>
            </li>
            <li className="flex items-center space-x-2 p-2 transition-colors">
              <div className="border-primary m-0 h-4 w-4 shrink-0 border"></div>
              <label className="m-0">
                <Skeleton className="w-[248px] max-w-full" />
              </label>
            </li>
            <li className="flex items-center space-x-2 p-2 transition-colors">
              <div className="border-primary m-0 h-4 w-4 shrink-0 border"></div>
              <label className="m-0">
                <Skeleton className="w-[504px] max-w-full" />
              </label>
            </li>
            <li className="flex items-center space-x-2 p-2 transition-colors">
              <div className="border-primary m-0 h-4 w-4 shrink-0 border"></div>
              <label className="m-0">
                <Skeleton className="w-[336px] max-w-full" />
              </label>
            </li>
            <li className="flex items-center space-x-2 p-2 transition-colors">
              <div className="border-primary m-0 h-4 w-4 shrink-0 border"></div>
              <label className="m-0">
                <Skeleton className="w-20 max-w-full" />
              </label>
            </li>
            <li className="flex items-center space-x-2 p-2 transition-colors">
              <div className="border-primary m-0 h-4 w-4 shrink-0 border"></div>
              <label className="m-0">
                <Skeleton className="w-[264px] max-w-full" />
              </label>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-border h-px w-full shrink-0"></div>
    </div>
  </>
)
