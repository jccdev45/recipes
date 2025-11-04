"use client"

import { Fragment, Suspense } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getUserWithRecipes } from "@/queries/user-queries"
import { createClient } from "@/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { Loader2, MessageCircleWarning, UserCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Typography } from "@/components/ui/typography"
import { RecipeCard } from "@/app/recipes/recipe-card"

import type { UserWithRecipes } from "@/lib/types"
import type { User } from "@supabase/supabase-js"

const ProfileInfo = ({
  userWithRecipes,
}: {
  userWithRecipes: UserWithRecipes
}) => (
  <div className="flex items-center space-x-4">
    <Avatar className="aspect-square size-20 border">
      <AvatarImage
        alt={`${userWithRecipes.first_name} ${userWithRecipes.last_name}`}
        src={userWithRecipes.avatar_url ?? "https://placehold.co/80"}
      />
      <AvatarFallback>
        {userWithRecipes.first_name?.[0]}
        {userWithRecipes.last_name?.[0]}
      </AvatarFallback>
    </Avatar>
    <div className="text-sm">
      <Typography variant="h4" className="font-semibold">
        {userWithRecipes.first_name} {userWithRecipes.last_name}
      </Typography>
    </div>
  </div>
)

const AuthUserInfo = ({ user }: { user: User }) => (
  <div className="grid grid-cols-3 gap-2">
    {[
      { label: "Email", value: user.email },
      {
        label: "Joined",
        value: new Date(user.created_at).toLocaleDateString("en-US"),
      },
      {
        label: "Last login",
        value: new Date(user.last_sign_in_at!).toLocaleDateString("en-US"),
      },
    ].map(({ label, value }) => (
      <Fragment key={label}>
        <Typography variant="muted">{label}</Typography>
        <Typography variant="small" className="col-span-2">
          {value}
        </Typography>
      </Fragment>
    ))}
  </div>
)

const RecipesList = ({
  recipes,
  user,
}: {
  recipes: UserWithRecipes["recipes"]
  user: User | null
}) => {
  if (!recipes.length) {
    return (
      <Alert>
        <MessageCircleWarning className="size-5" />
        <AlertTitle>Oh</AlertTitle>
        <AlertDescription>
          No recipes yet!{" "}
          <Link
            href="/recipes/add"
            className="hover:text-foreground/90 font-semibold underline transition-colors duration-200 ease-in-out"
          >
            Add one today!
          </Link>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} user={user} />
      ))}
    </div>
  )
}

const RecipesFallback = () => (
  <>
    {[1, 2, 3].map((i) => (
      <Skeleton key={i} className="col-span-1 mx-auto h-40 w-5/6" />
    ))}
  </>
)

export function UserProfile({
  currentUser,
  user_id,
}: {
  user_id: string
  currentUser: User | null
}) {
  const supabase = createClient()
  const {
    data: profileUser,
    isLoading,
    error,
  } = useQuery(getUserWithRecipes(supabase, user_id))

  const isOwnProfile = currentUser?.id === user_id

  if (!isLoading && !isOwnProfile) {
    redirect("/recipes")
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-20 animate-spin" />
      </div>
    )
  }

  if (error || !profileUser) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error?.message || "Failed to load profile. Please try again."}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 p-4 backdrop-blur-md md:grid-cols-2 lg:p-6 lg:py-16">
      <section className="space-y-6">
        <div className="space-y-8">
          <ProfileInfo userWithRecipes={profileUser} />
          {isOwnProfile && currentUser && <AuthUserInfo user={currentUser} />}
          {isOwnProfile && (
            <Button asChild size="lg">
              <Link
                href={`/profile/${user_id}/edit`}
                className="flex items-center gap-4"
              >
                <UserCircle /> <span>Edit Profile</span>
              </Link>
            </Button>
          )}
        </div>
      </section>
      <section className="space-y-6 lg:space-y-10">
        <Card>
          <CardHeader className="p-4">
            <Typography
              variant="h3"
              className="text-muted-foreground text-lg font-semibold"
            >
              Recipes by{" "}
              <span className="text-foreground font-bold">
                {profileUser.first_name || "user"}
              </span>
              :
            </Typography>
          </CardHeader>
          <CardContent className="p-4">
            <Suspense fallback={<RecipesFallback />}>
              <RecipesList recipes={profileUser.recipes} user={currentUser} />
            </Suspense>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
