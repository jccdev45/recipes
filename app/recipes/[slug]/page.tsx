import type { Metadata, ResolvingMetadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAuthUser } from "@/supabase/helpers"
import { createClient } from "@/supabase/server"
import { Recipe } from "@/supabase/types"

import { apiUrl } from "@/lib/constants"
import { shimmer, toBase64 } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  TypographyBlockquote,
  TypographyH1,
  TypographyList,
} from "@/components/ui/typography"
import { GradientBanner } from "@/components/GradientBanner"
import { CommentsSection } from "@/app/recipes/[slug]/Comments"

import { Ingredients } from "./Ingredients"
import { Steps } from "./Steps"

type RecipePageProps = {
  params: { slug: string }
}

export async function generateMetadata(
  { params: { slug } }: RecipePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const res = await fetch(`${apiUrl}/recipes/${slug}`)
  const recipe: Recipe = await res.json()
  const previousTitle = (await parent).title?.absolute || ""

  return {
    title: `${recipe?.recipe_name} | ${previousTitle}`,
  }
}

export default async function RecipePage({
  params: { slug },
}: RecipePageProps) {
  const res = await fetch(`${apiUrl}/recipes/${slug}`)
  const recipe: Recipe = await res.json()

  const supabase = createClient()
  const user = await getAuthUser(supabase)

  {
    !recipe && notFound()
  }

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
    <div className="space-y-4 px-4">
      <GradientBanner />

      <div className="flex flex-col gap-8">
        <header className="grid grid-cols-1 md:grid-cols-2">
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

        <CommentsSection
          currentUser={user!}
          recipe_id={id}
          className="flex w-full max-w-full flex-col"
        />
      </div>
    </div>
  )
}
