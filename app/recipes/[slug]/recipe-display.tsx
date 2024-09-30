"use client"

import Image from "next/image"
import Link from "next/link"
import { getRecipeBySlug } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { User } from "@supabase/supabase-js"

import { Recipe } from "@/lib/types"
import { shimmer, toBase64 } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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

  return (
    <header className="grid grid-cols-1 gap-8 rounded-md bg-primary/30 py-8 md:grid-cols-2">
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
          src={recipe.img || "http://unsplash.it/g/450/325?gravity=center"}
          alt={recipe.recipe_name || "Generic fallback"}
          width={450}
          height={325}
          className="rounded-md shadow shadow-foreground"
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
  const { data, isLoading, error } = useQuery(getRecipeBySlug(supabase, slug))
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
      <div className="flex flex-1 items-start justify-center rounded bg-destructive/20 py-20">
        <Typography variant="error" className="text-2xl">
          An error occurred: {error.message}
        </Typography>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <RecipeHeader recipe={recipe} user={user} />
      <RecipeContent recipe={recipe} />
      <Separator />
    </div>
  )
}
