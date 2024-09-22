"use client"

import Image from "next/image"
import { getRecipeBySlug } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { User } from "@supabase/supabase-js"
import { Badge, Link } from "lucide-react"

import { Recipe } from "@/lib/types"
import { shimmer, toBase64 } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import {
  TypographyBlockquote,
  TypographyH1,
  TypographyList,
} from "@/components/ui/typography"
import { Ingredients } from "@/app/recipes/[slug]/ingredients"
import { Steps } from "@/app/recipes/[slug]/steps"

export function RecipeDisplay({
  slug,
  user,
}: {
  slug: string
  user: User | null
}) {
  const supabase = createClient()
  const { data, isLoading, error } = useQuery(getRecipeBySlug(supabase, slug))
  const recipe = data as unknown as Recipe

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  const {
    author,
    id,
    img,
    ingredients,
    quote,
    recipe_name,
    steps,
    tags,
    user_id,
  } = recipe

  return (
    <>
      <header className="grid grid-cols-1 bg-primary/30 py-4 md:grid-cols-2">
        <div className="my-auto grid h-fit place-items-center">
          <TypographyH1>{recipe_name}</TypographyH1>
          <TypographyBlockquote>{quote}</TypographyBlockquote>

          {user_id ? (
            <Link
              href={`/profile/${user_id}`}
              className="inline-flex items-center text-lg underline"
            >
              - {author}
            </Link>
          ) : (
            author
          )}
          <TypographyList className="space-x-2">
            {tags.map(({ id, tag }) => (
              <Badge key={id}>{tag}</Badge>
            ))}
          </TypographyList>
        </div>

        <Image
          src={img || "http://unsplash.it/g/300/300?gravity=center"}
          alt={recipe_name || "Generic fallback"}
          width={450}
          height={325}
          className="mx-auto shadow shadow-foreground"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(
            shimmer(450, 325)
          )}`}
        />
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <section>
          {ingredients && (
            <Ingredients
              ingredients={ingredients}
              className="col-span-full flex flex-col lg:col-span-1"
            />
          )}
        </section>
        <section>
          {steps && (
            <Steps
              steps={steps}
              className="col-span-full flex flex-col lg:col-span-1"
            />
          )}
        </section>
      </div>

      <Separator />
    </>
  )
}
