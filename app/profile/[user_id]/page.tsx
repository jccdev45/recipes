import { Suspense } from "react"
import { Metadata, ResolvingMetadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getAll } from "@/supabase/helpers"
import { createClient } from "@/supabase/server"
import { Recipe, User } from "@/supabase/types"
import { User2, UserCircle, UserCircle2 } from "lucide-react"

import { apiUrl } from "@/lib/constants"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  TypographyH1,
  TypographyH3,
  TypographyH4,
  TypographyLarge,
  TypographyLead,
  TypographyMuted,
  TypographySmall,
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
    }'s profile | ${previousTitle}`,
  }
}

export default async function ProfilePage({
  params: { user_id },
}: {
  params: { user_id: string }
}) {
  const supabase = createClient()
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

  const { first_name, last_name, avatar_url }: User = await user.json()

  return (
    <div className="mx-auto space-y-4">
      <GradientBanner />

      <div className="mx-auto grid grid-cols-1 gap-8 bg-gray-100 p-4 backdrop-blur-md md:grid-cols-2 lg:p-6">
        <section className="space-y-6">
          <header className="space-y-4">
            <TypographyH1>My Profile</TypographyH1>
            <TypographyLead>
              Manage your profile information here
            </TypographyLead>
          </header>
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <Avatar className="aspect-square size-20 border">
                <AvatarImage
                  alt={`${first_name} ${last_name}`}
                  src={avatar_url ? avatar_url : `https://placehold.co/100`}
                />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <TypographyH4 className="font-semibold">
                  {first_name} {last_name}
                </TypographyH4>
                <TypographyLead className="text-base">
                  {data.user.email}
                </TypographyLead>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 ">
              <TypographyMuted>Joined</TypographyMuted>
              <TypographySmall className="col-span-2">
                {new Date(data.user.created_at).toLocaleDateString("en-US")}
              </TypographySmall>
              <TypographyMuted>Last login</TypographyMuted>
              <TypographySmall className="col-span-2">
                {new Date(data.user.last_sign_in_at!).toLocaleDateString(
                  "en-US"
                )}
              </TypographySmall>
            </div>

            <Button asChild variant="outline" className="gap-4">
              <Link href={`/profile/${user_id}/edit`}>
                <UserCircle /> Edit Profile
              </Link>
            </Button>
          </div>
        </section>
        <section className="space-y-6 lg:space-y-10">
          <Card>
            <CardHeader className="p-4">
              <TypographyH3 className="text-lg font-bold">
                Recipes by me:
              </TypographyH3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
                <Suspense fallback={<RecipesFallback />}>
                  {recipes?.length ? (
                    recipes?.map((recipe) => (
                      <RecipeCard key={recipe.id} recipe={recipe} />
                    ))
                  ) : (
                    <TypographyLarge>No recipes yet</TypographyLarge>
                  )}
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

function RecipesFallback() {
  return (
    <>
      <Skeleton className="col-span-1 mx-auto w-5/6"></Skeleton>
      <Skeleton className="col-span-1 mx-auto w-5/6"></Skeleton>
      <Skeleton className="col-span-1 mx-auto w-5/6"></Skeleton>
    </>
  )
}
