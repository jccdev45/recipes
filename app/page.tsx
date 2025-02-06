import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { getFeaturedRecipes } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/server"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Typography } from "@/components/ui/typography"
import { FeaturedRecipes } from "@/components/featured-recipes"

export default async function Index() {
  const supabase = await createClient()
  const queryClient = new QueryClient()

  await prefetchQuery(queryClient, getFeaturedRecipes(supabase))

  return (
    <>
      <HomeHero />

      <section className="w-full px-4 py-6 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="text-center">
            <Typography variant="h2" className="border-none">
              Family Recipes
            </Typography>
            <Typography variant="h3" className="mb-4 border-b border-border">
              <span className="bg-gradient-to-r from-[#EF0000] from-10% via-black/10 via-20% to-[#004EF1] bg-clip-text text-transparent dark:via-white dark:to-[#004EF1]">
                Puerto Rican
              </span>{" "}
              style
            </Typography>
            <Typography variant="p" className="mb-4 text-left lg:text-justify">
              Welcome to a collection of family recipes, packed with just as
              much love as flavor. Inside, you'll find a variety of recipes from
              Puerto Rican classics like pernil and arroz con gandules to dishes
              like chicken marsala and potato salad, even a refreshing mojito
              recipe.
            </Typography>
            <Typography variant="large" className="mb-4 md:text-xl">
              There's a little something for everyone.
            </Typography>
            <Typography variant="lead" className="">
              You like flavor don't you? <strong>Good!</strong> <br /> You're in
              the right place.
            </Typography>
          </div>

          <Separator className="block lg:hidden" />

          <div className="flex flex-col items-center justify-center gap-6">
            <div className="text-center">
              <Typography variant="h4" className="mb-2">
                Ready to explore?
              </Typography>
              <Typography variant="muted">
                Dive into our collection or share your own family favorites.
              </Typography>
            </div>
            <div className="w-full max-w-md space-y-4 rounded-lg bg-secondary/10 p-6 shadow-inner">
              <Button asChild className="w-full" size="lg">
                <Link href="/recipes">Browse Recipes</Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href="/recipes/add">Contribute a Recipe</Link>
              </Button>
            </div>
            <Typography variant="small" className="text-center md:text-left">
              Join our community of food lovers and family recipe enthusiasts!
            </Typography>
          </div>
        </div>
      </section>

      <section className="p-2">
        <Typography variant="h2" className="my-4 text-center">
          Featured recipes:
        </Typography>
        <div className="grid w-full grid-cols-1 gap-y-2 md:grid-cols-3 md:gap-x-3">
          <Suspense fallback={<RecipesFallback />}>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <FeaturedRecipes />
            </HydrationBoundary>
          </Suspense>
        </div>
      </section>
    </>
  )
}

function HomeHero() {
  return (
    <section className="relative h-[400px] overflow-hidden rounded-lg">
      <Image
        src="https://images.unsplash.com/photo-1527756898251-203e9ce0d9c4?q=80&w=2950&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Dinner table with two empty glasses, plates of salad, bottle of oil"
        className="size-full object-cover object-bottom"
        fill
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70">
        <div className="space-y-4 text-center text-background dark:text-foreground">
          <Typography variant="h1">Welcome!</Typography>
          <Typography variant="large">
            Discover and share beloved recipes passed down through generations
          </Typography>
          <div className="isolation-auto">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/recipes">Explore Recipes</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function RecipesFallback() {
  return (
    <>
      <Skeleton className="col-span-1 mx-auto w-3/4 md:w-5/6"></Skeleton>
      <Skeleton className="col-span-1 mx-auto w-3/4 md:w-5/6"></Skeleton>
      <Skeleton className="col-span-1 mx-auto w-3/4 md:w-5/6"></Skeleton>
    </>
  )
}
