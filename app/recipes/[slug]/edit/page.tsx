import { notFound, redirect } from "next/navigation"
import { getRecipeBySlug } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/server"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { CheckCircle2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { getUser } from "@/app/(auth)/actions"
import { EditRecipeForm } from "@/app/recipes/[slug]/edit/edit-recipe-form"

import type { Metadata } from "next"

type EditRecipePageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { slug } = await params

  try {
    const supabase = await createClient()
    const { data: recipe } = await getRecipeBySlug(supabase, slug)

    if (!recipe) {
      notFound()
    }

    return {
      title: `Edit ${recipe.recipe_name}`,
      description: `Refresh the details for ${recipe.recipe_name} so everyone sees the latest version.`,
    }
  } catch (error) {
    console.error("Error fetching recipe metadata:", error)
    return {
      title: "Edit Recipe",
      description:
        "Update your recipe with improved instructions and ingredients.",
    }
  }
}

export default async function EditRecipePage(props: EditRecipePageProps) {
  const params = await props.params
  const { slug } = params

  const { user, error } = await getUser()

  if (error) {
    console.error(error)
    redirect(`/auth-error?message=${encodeURIComponent(error.message)}`)
  }

  if (!user) {
    redirect("/login")
  }

  const supabase = await createClient()
  const queryClient = new QueryClient()

  const { data: recipe } = await getRecipeBySlug(supabase, slug)

  if (!recipe) {
    notFound()
  }

  if (recipe.user_id && recipe.user_id !== user.id) {
    redirect(`/recipes/${slug}`)
  }

  await prefetchQuery(queryClient, getRecipeBySlug(supabase, slug))

  const updatedAtLabel = recipe.last_updated
    ? new Date(recipe.last_updated).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <>
      <a
        href="#edit-recipe-form"
        className="focus-visible:bg-primary focus-visible:text-primary-foreground sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:px-4 focus-visible:py-2"
      >
        Skip to recipe form
      </a>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-16 sm:px-6 lg:px-8">
        <section
          aria-labelledby="edit-recipe-heading"
          className="from-primary/15 via-background to-background relative overflow-hidden rounded-3xl border bg-linear-to-br shadow-lg"
        >
          <div
            className="bg-primary/20 pointer-events-none absolute top-12 -right-24 h-72 w-72 rounded-full blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-16 left-8 h-60 w-60 rounded-full bg-amber-300/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative grid gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
            <div className="space-y-6">
              <Badge
                variant="outline"
                className="border-primary/40 bg-primary/10 text-primary w-fit"
              >
                Recipe maintenance
              </Badge>
              <Typography
                variant="h1"
                id="edit-recipe-heading"
                className="text-foreground text-3xl leading-tight font-semibold sm:text-4xl md:text-5xl"
              >
                Refresh {recipe.recipe_name}
              </Typography>
              <Typography className="text-muted-foreground max-w-xl text-base sm:text-lg">
                Update instructions, ingredients, and imagery so your family and
                friends always have the clearest path to recreating this dish.
              </Typography>

              <ul className="text-muted-foreground grid gap-4 sm:grid-cols-2">
                {[
                  "Keep ingredient measurements consistent",
                  "Clarify multi-step instructions",
                  "Highlight new serving suggestions",
                  "Let everyone know about seasonal tweaks",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm sm:text-base"
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="text-primary mt-1 h-5 w-5"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="bg-background/80 space-y-4 rounded-3xl border p-6 shadow-xl">
              <div className="space-y-2">
                <Typography variant="h3" className="text-xl font-semibold">
                  Need a quick preview?
                </Typography>
                <Typography variant="muted" className="text-sm leading-relaxed">
                  Review the live recipe in a new tab to compare updates
                  side-by-side.
                </Typography>
              </div>
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <a href={`/recipes/${slug}`}>View current recipe</a>
              </Button>
              {updatedAtLabel ? (
                <Typography variant="muted" className="text-xs">
                  Last updated on {updatedAtLabel}
                </Typography>
              ) : null}
            </aside>
          </div>
        </section>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <EditRecipeForm className="mx-auto w-full" slug={slug} user={user} />
        </HydrationBoundary>
      </main>
    </>
  )
}
