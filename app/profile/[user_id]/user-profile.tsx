"use client"

import Link from "next/link"
import { redirect } from "next/navigation"
import { getUserWithRecipes } from "@/queries/user-queries"
import { createClient } from "@/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import {
  BookOpen,
  CalendarDays,
  Clock,
  Loader2,
  MessageCircleWarning,
  UserCircle,
} from "lucide-react"

import { resolveStorageImageUrl } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { UserAvatar } from "@/components/user-avatar"
import { RecipeCard } from "@/app/recipes/recipe-card"

import type { UserWithRecipes } from "@/lib/types"
import type { User } from "@supabase/supabase-js"
import type { LucideIcon } from "lucide-react"

const formatDate = (value?: string | null) => {
  if (!value) {
    return "Not available"
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "Not available"
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const createDisplayName = (
  profileUser: Pick<UserWithRecipes, "first_name" | "last_name">
) => {
  const parts = [profileUser.first_name, profileUser.last_name]
    .map((part) => (part && part.trim().length ? part.trim() : null))
    .filter((part): part is string => Boolean(part))

  return parts.length ? parts.join(" ") : "Family Recipes Member"
}

const ProfileSummary = ({
  profileUser,
  isOwnProfile,
  recipeCount,
  currentUserEmail,
}: {
  profileUser: UserWithRecipes
  isOwnProfile: boolean
  recipeCount: number
  currentUserEmail?: string | null
}) => {
  const displayName = createDisplayName(profileUser)
  const resolvedAvatar = resolveStorageImageUrl(profileUser.avatar_url)
  const avatarEmail = isOwnProfile ? currentUserEmail : undefined

  return (
    <section
      aria-labelledby="profile-summary-heading"
      className="from-background via-background to-muted/40 relative overflow-hidden rounded-3xl border bg-linear-to-br p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4 sm:gap-6">
          <UserAvatar
            size="xl"
            firstName={profileUser.first_name}
            lastName={profileUser.last_name}
            email={avatarEmail ?? undefined}
            src={resolvedAvatar}
            className="border-background ring-primary/10 size-20 border-2 shadow-lg ring-4 sm:size-24"
          />
          <div className="space-y-3">
            <Typography
              variant="h2"
              id="profile-summary-heading"
              className="text-3xl leading-tight font-semibold text-balance sm:text-4xl"
            >
              {displayName}
            </Typography>
            <Typography variant="muted" className="max-w-xl text-base">
              {recipeCount > 0
                ? `Sharing ${recipeCount} ${
                    recipeCount === 1 ? "recipe" : "recipes"
                  } with the Family Recipes community.`
                : "Showcase your favorite dishes so loved ones can cook along with you."}
            </Typography>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-primary bg-white/70">
                Family Recipes Member
              </Badge>
              {isOwnProfile ? (
                <Badge
                  variant="outline"
                  className="border-primary/40 text-primary"
                >
                  Your profile is private to you
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
        {isOwnProfile ? (
          <Button asChild size="lg" className="self-start sm:self-auto">
            <Link href={`/profile/${profileUser.id}/edit`}>
              <span className="inline-flex items-center gap-2">
                <UserCircle className="h-5 w-5" aria-hidden="true" />
                <span>Edit profile</span>
              </span>
            </Link>
          </Button>
        ) : null}
      </div>
      <ProfileStats
        recipeCount={recipeCount}
        createdAt={profileUser.created_at}
        lastUpdated={profileUser.last_updated}
      />
    </section>
  )
}

const ProfileStats = ({
  recipeCount,
  createdAt,
  lastUpdated,
}: {
  recipeCount: number
  createdAt?: string | null
  lastUpdated?: string | null
}) => (
  <dl className="mt-8 grid gap-4 sm:grid-cols-3">
    <ProfileStat
      icon={BookOpen}
      label="Recipes published"
      value={`${recipeCount}`}
    />
    <ProfileStat
      icon={CalendarDays}
      label="Member since"
      value={formatDate(createdAt)}
    />
    <ProfileStat
      icon={Clock}
      label="Last updated"
      value={formatDate(lastUpdated)}
    />
  </dl>
)

const ProfileStat = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) => (
  <div className="bg-background/80 flex items-center gap-4 rounded-2xl border p-4 shadow-sm">
    <span className="text-primary bg-primary/10 flex size-12 items-center justify-center rounded-full">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
    <div className="space-y-1">
      <Typography variant="muted" className="text-xs tracking-wide uppercase">
        {label}
      </Typography>
      <Typography
        variant="large"
        className="text-foreground text-base font-semibold"
      >
        {value}
      </Typography>
    </div>
  </div>
)

const AccountDetailsCard = ({ user }: { user: User }) => {
  const accountDetails = [
    { term: "Email", description: user.email ?? "Not available" },
    { term: "Joined", description: formatDate(user.created_at) },
    { term: "Last login", description: formatDate(user.last_sign_in_at) },
  ]

  return (
    <Card aria-labelledby="account-details-heading">
      <CardHeader className="pb-2">
        <Typography
          variant="h3"
          id="account-details-heading"
          className="text-xl font-semibold"
        >
          Account details
        </Typography>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4">
          {accountDetails.map(({ term, description }) => (
            <div key={term} className="space-y-1">
              <dt className="text-muted-foreground text-sm font-medium">
                {term}
              </dt>
              <dd className="text-foreground text-sm font-semibold wrap-break-word">
                {description}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

const RecipesSection = ({
  recipes,
  currentUser,
  isOwnProfile,
}: {
  recipes: UserWithRecipes["recipes"]
  currentUser: User | null
  isOwnProfile: boolean
}) => {
  const headingId = "profile-recipes-heading"

  if (!recipes.length) {
    return (
      <section aria-labelledby={headingId} className="space-y-4">
        <Typography
          variant="h2"
          id={headingId}
          className="text-2xl font-semibold"
        >
          Recipes
        </Typography>
        <RecipesEmptyState isOwnProfile={isOwnProfile} />
      </section>
    )
  }

  return (
    <section aria-labelledby={headingId} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Typography
          variant="h2"
          id={headingId}
          className="text-2xl font-semibold"
        >
          Recipes
        </Typography>
        {isOwnProfile ? (
          <Button asChild variant="secondary">
            <Link href="/recipes/add">Add a recipe</Link>
          </Button>
        ) : null}
      </div>
      <ul role="list" className="grid gap-6 md:grid-cols-2">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="flex">
            <RecipeCard recipe={recipe} user={currentUser} className="h-full" />
          </li>
        ))}
      </ul>
    </section>
  )
}

const RecipesEmptyState = ({ isOwnProfile }: { isOwnProfile: boolean }) => (
  <Card className="border-dashed">
    <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
      <MessageCircleWarning
        className="text-muted-foreground h-8 w-8"
        aria-hidden="true"
      />
      <Typography variant="h3" className="text-lg font-semibold">
        No recipes yet
      </Typography>
      <Typography variant="muted" className="max-w-sm text-balance">
        {isOwnProfile
          ? "Start building your collection so friends and family can cook along."
          : "This cook hasn’t shared any recipes with the community yet."}
      </Typography>
      {isOwnProfile ? (
        <Button asChild>
          <Link href="/recipes/add">Create your first recipe</Link>
        </Button>
      ) : null}
    </CardContent>
  </Card>
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
      <div
        className="flex h-[40vh] flex-col items-center justify-center gap-3"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
        <Typography variant="muted">Loading profile...</Typography>
      </div>
    )
  }

  if (error || !profileUser) {
    return (
      <Alert variant="destructive" className="max-w-2xl" role="alert">
        <AlertTitle>We couldn’t load this profile</AlertTitle>
        <AlertDescription>
          {error?.message || "Please refresh the page or try again later."}
        </AlertDescription>
      </Alert>
    )
  }

  const recipeCount = profileUser.recipes?.length ?? 0
  const showAccountPanel = Boolean(isOwnProfile && currentUser)

  return (
    <div className="flex flex-col gap-8">
      <ProfileSummary
        profileUser={profileUser}
        isOwnProfile={isOwnProfile}
        recipeCount={recipeCount}
        currentUserEmail={currentUser?.email ?? null}
      />

      {showAccountPanel ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,320px),1fr] xl:gap-10">
          <div className="space-y-6">
            {currentUser ? <AccountDetailsCard user={currentUser} /> : null}
          </div>
          <RecipesSection
            recipes={profileUser.recipes}
            currentUser={currentUser}
            isOwnProfile={isOwnProfile}
          />
        </div>
      ) : (
        <RecipesSection
          recipes={profileUser.recipes}
          currentUser={currentUser}
          isOwnProfile={isOwnProfile}
        />
      )}
    </div>
  )
}
