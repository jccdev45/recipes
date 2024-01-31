import { Metadata, ResolvingMetadata } from "next"
import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getAll } from "@/supabase/helpers"
import { createClient } from "@/supabase/server"
import { Edit, UserCircle2 } from "lucide-react"

import { Recipe, User } from "@/types/supabase"
import { apiUrl } from "@/lib/constants"
import { shimmer, toBase64 } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import {
  TypographyH2,
  TypographyH3,
  TypographyH4,
} from "@/components/ui/typography"
import { GradientBanner } from "@/components/GradientBanner"
import { RecipeCard } from "@/app/recipes/RecipeCard"

type Props = {
  params: { user_id: string }
}

export async function generateMetadata(
  { params: { user_id } }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const res = await fetch(`${apiUrl}/profiles/${user_id}`)
  const user: User = await res.json()
  const previousTitle = (await parent).title?.absolute || ""

  return {
    title: `${
      user?.first_name ? user.first_name : user.user_id
    } | profile | ${previousTitle}`,
  }
}

export default async function ProfilePage({
  params: { user_id },
}: {
  params: { user_id: string }
}) {
  const supabase = createClient(cookies())
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    redirect("/login")
  }

  const recipeParams = {
    filters: {
      column: "user_id",
      value: user_id,
    },
  }

  const user = await fetch(`${apiUrl}/profiles/${user_id}`)
  const recipes: Recipe[] | null = await getAll(
    { db: "recipes", params: recipeParams },
    supabase
  )

  const { first_name, last_name, avatar_url, created_at, last_updated } =
    ((await user.json()) as User) || {}

  return (
    <section className="h-full">
      <GradientBanner />

      {!user && notFound()}

      {user && (
        <div className="mx-auto flex w-5/6 flex-col justify-between md:px-8">
          {/* TODO: add change avatar dialog */}
          <div className="w-full -translate-y-1/4">
            <div className="h-24 w-24">
              {/* <AspectRatio ratio={1 / 1}> */}
              {avatar_url ? (
                <Image
                  src={avatar_url}
                  width={200}
                  height={200}
                  alt={`${first_name} ${last_name}`}
                  className="aspect-square size-24 rounded-full border-2 border-foreground object-cover"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    shimmer(96, 96)
                  )}`}
                />
              ) : (
                <UserCircle2 />
              )}
              {/* </AspectRatio> */}
            </div>

            {/* TODO: ADJUST TYPOGRAPHY & LAYOUT */}
            <TypographyH2>
              {first_name} {last_name}
            </TypographyH2>
            {data.user?.id === user_id && (
              <TypographyH4>Email: {data.user?.email}</TypographyH4>
            )}

            {created_at && (
              <TypographyH4>
                Joined: {new Date(created_at).toLocaleDateString("en-US")}
              </TypographyH4>
            )}

            <Button asChild>
              <Link href={`/profile/${user_id}/edit`} className="my-4 flex">
                <Edit /> Edit Profile
              </Link>
            </Button>
          </div>
          <TypographyH3>
            Recipes:
            {/* {first_name ? `Recipes by: ${first_name}` : ``} */}
          </TypographyH3>
          <aside className="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {recipes?.length ? (
              recipes.map((recipe) => {
                return (
                  <RecipeCard
                    key={recipe.id}
                    className="col-span-1 mx-auto w-full"
                    recipe={recipe}
                  />
                )
              })
            ) : (
              <>
                This is where {first_name}'s recipes would be...
                <em>IF THEY ADDED ANY</em>
              </>
            )}
          </aside>
        </div>
      )}
    </section>
  )
}
