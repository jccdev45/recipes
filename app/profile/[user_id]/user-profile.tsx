"use client"

import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getUserWithRecipes } from "@/queries/user-queries"
import { createClient } from "@/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { Link, Loader2, UserCircle } from "lucide-react"

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
import { RecipeCard } from "@/app/recipes/RecipeCard"

import type { UserWithRecipes } from "@/lib/types"
import type { User } from "@supabase/supabase-js"

function ProfileInfo({ user }: { user: UserWithRecipes }) {
  return (
    <div className="flex items-center space-x-4">
      <Avatar className="aspect-square size-20 border">
        <AvatarImage
          alt={`${user.first_name} ${user.last_name}`}
          src={user.avatar_url ?? "https://placehold.co/80"}
        />
        <AvatarFallback>
          {user.first_name?.[0]}
          {user.last_name?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="text-sm">
        <TypographyH4 className="font-semibold">
          {user.first_name} {user.last_name}
        </TypographyH4>
      </div>
    </div>
  )
}

function AuthUserInfo({ user }: { user: User }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <TypographyMuted>Email</TypographyMuted>
      <TypographySmall className="col-span-2">{user.email}</TypographySmall>
      <TypographyMuted>Joined</TypographyMuted>
      <TypographySmall className="col-span-2">
        {new Date(user.created_at).toLocaleDateString("en-US")}
      </TypographySmall>
      <TypographyMuted>Last login</TypographyMuted>
      <TypographySmall className="col-span-2">
        {new Date(user.last_sign_in_at!).toLocaleDateString("en-US")}
      </TypographySmall>
    </div>
  )
}

function RecipesList({ recipes }: { recipes: UserWithRecipes["recipes"] }) {
  if (!recipes.length) {
    return <TypographyLarge>No recipes yet</TypographyLarge>
  }

  return (
    <>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </>
  )
}

function RecipesFallback() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="col-span-1 mx-auto w-5/6" />
      ))}
    </>
  )
}

export function UserProfile({
  currentUser,
  user_id,
}: {
  user_id: string
  currentUser: User | null
}) {
  const supabase = createClient()
  const { data, isLoading, error } = useQuery(
    getUserWithRecipes(supabase, user_id)
  )
  const profileUser = data as unknown as UserWithRecipes

  const isOwnProfile = currentUser?.id === user_id

  if (!isLoading && !isOwnProfile) {
    redirect("/recipes")
  }

  if (isLoading) {
    return <Loader2 className="size-20 animate-spin" />
  }

  if (error || !profileUser) {
    return <div>Error loading profile: {error?.message || "Unknown error"}</div>
  }

  return (
    <div className="mx-auto grid grid-cols-1 gap-8 p-4 backdrop-blur-md md:grid-cols-2 lg:p-6">
      <section className="space-y-6">
        <header className="space-y-4">
          <TypographyH1>Profile</TypographyH1>
          <TypographyLead>User profile information</TypographyLead>
        </header>
        <div className="space-y-8">
          <ProfileInfo user={profileUser} />
          {isOwnProfile && currentUser && <AuthUserInfo user={currentUser} />}
          {isOwnProfile && (
            <Button asChild variant="outline" className="gap-4">
              <Link href={`/profile/${user_id}/edit`}>
                <UserCircle /> Edit Profile
              </Link>
            </Button>
          )}
        </div>
      </section>
      <section className="space-y-6 lg:space-y-10">
        <Card>
          <CardHeader className="p-4">
            <TypographyH3 className="text-lg font-bold">
              Recipes by {profileUser.first_name || "user"}:
            </TypographyH3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
              <Suspense fallback={<RecipesFallback />}>
                <RecipesList recipes={profileUser.recipes} />
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
