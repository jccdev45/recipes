import { Suspense } from "react"
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
import { Hero } from "@/components/hero"

export default async function Index() {
  const supabase = await createClient()
  const queryClient = new QueryClient()

  await prefetchQuery(queryClient, getFeaturedRecipes(supabase))

  return (
    <>
      <Hero
        type="video"
        videoSources={[
          "/videos/onions.mp4",
          "/videos/chef.mp4",
          "/videos/tomatoes.mp4",
        ]}
        title="Welcome!"
        subtitle="Discover and share beloved recipes passed down through generations"
        ctaText="Explore Recipes"
        ctaLink="/recipes"
      />

      <section className="w-full px-4 py-6 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 lg:grid-cols-1">
            <div className="">
              <Typography variant="h2" className="border-none">
                Family Recipes
              </Typography>
              <Typography variant="h3" className="mb-4 border-b border-border">
                <span className="bg-gradient-to-r from-[#EF0000] from-10% via-black/10 via-20% to-[#004EF1] bg-clip-text text-transparent dark:via-white dark:to-[#004EF1]">
                  Puerto Rican
                </span>{" "}
                style
              </Typography>
            </div>
            <div className="">
              <Typography
                variant="p"
                className="mb-4 text-left lg:text-justify"
              >
                Welcome to a collection of family recipes, packed with just as
                much love as flavor. Inside, you'll find a variety of recipes
                from Puerto Rican classics like pernil and arroz con gandules to
                dishes like chicken marsala and potato salad, even a refreshing
                mojito recipe.
              </Typography>
              <Typography variant="large" className="mb-4 md:text-xl">
                There's a little something for everyone.
              </Typography>
              <Typography variant="lead" className="">
                You like flavor don't you? <strong>Good!</strong> <br /> You're
                in the right place.
              </Typography>
            </div>
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

function RecipesFallback() {
  return (
    <>
      <Skeleton className="col-span-1 mx-auto w-3/4 md:w-5/6"></Skeleton>
      <Skeleton className="col-span-1 mx-auto w-3/4 md:w-5/6"></Skeleton>
      <Skeleton className="col-span-1 mx-auto w-3/4 md:w-5/6"></Skeleton>
    </>
  )
}
