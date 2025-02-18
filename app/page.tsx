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
          "https://nbwdildsbmoetwhe.public.blob.vercel-storage.com/onions-3ijkNNkNxCqwI6UYiQH3sGqk3j3GAV.mp4",
          "https://nbwdildsbmoetwhe.public.blob.vercel-storage.com/chef-PRV97AEi58qcIHRNaoZQdleB4V0KBW.mp4",
          "https://nbwdildsbmoetwhe.public.blob.vercel-storage.com/parsley-iRI1DTpoGcbhUZsbSjAnRHFRX5SvC5.mp4",
          "https://nbwdildsbmoetwhe.public.blob.vercel-storage.com/tomatoes-bznteJ2SHPEQ2S5N4AhshLGytkfQH7.mp4",
        ]}
        title="Welcome!"
        subtitle="Discover and share beloved recipes passed down through generations"
        ctaText="Explore Recipes"
        ctaLink="/recipes"
      />

      <section className="w-full px-4 py-8 md:py-16 lg:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <header className="text-center">
                <Typography variant="h2" className="mb-2 border-none">
                  Family Recipes
                </Typography>
                <Typography
                  variant="h3"
                  className="mb-4 border-b border-border pb-2"
                >
                  <span className="bg-gradient-to-r from-[#EF0000] from-10% via-black/10 via-20% to-[#004EF1] bg-clip-text text-transparent dark:via-white dark:to-[#004EF1]">
                    Puerto Rican
                  </span>{" "}
                  style
                </Typography>
              </header>
              <div className="space-y-4">
                <Typography variant="p" className="text-left lg:text-justify">
                  Welcome to a collection of family recipes, packed with just as
                  much love as flavor. Inside, you'll find a variety of recipes
                  from Puerto Rican classics like pernil and arroz con gandules
                  to dishes like chicken marsala and potato salad, even a
                  refreshing mojito recipe.
                </Typography>
                <Typography variant="large" className="text-center md:text-xl">
                  There's a little something for everyone.
                </Typography>
                <Typography variant="lead" className="text-center">
                  You like flavor don't you? <strong>Good!</strong> <br />{" "}
                  You're in the right place.
                </Typography>
              </div>
            </div>

            <Separator className="block lg:hidden" />

            <div className="flex flex-col items-center justify-center gap-8">
              <div className="text-center">
                <Typography variant="h4" className="mb-3">
                  Ready to explore?
                </Typography>
                <Typography variant="muted">
                  Dive into our collection or share your own family favorites.
                </Typography>
              </div>
              <div className="w-full max-w-md space-y-4 rounded-lg bg-secondary/10 p-8 shadow-inner">
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
        </div>
      </section>

      <section
        className="bg-secondary/5 px-4 py-12"
        aria-label="Featured recipes"
      >
        <div className="container mx-auto max-w-7xl">
          <Typography variant="h2" className="mb-8 text-center">
            Featured recipes:
          </Typography>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            <Suspense fallback={<RecipesFallback />}>
              <HydrationBoundary state={dehydrate(queryClient)}>
                <FeaturedRecipes />
              </HydrationBoundary>
            </Suspense>
          </div>
        </div>
      </section>
    </>
  )
}

function RecipesFallback() {
  return (
    <>
      <Skeleton
        className="col-span-1 mx-auto w-3/4 md:w-5/6"
        aria-label="Loading recipe card"
      />
      <Skeleton
        className="col-span-1 mx-auto w-3/4 md:w-5/6"
        aria-label="Loading recipe card"
      />
      <Skeleton
        className="col-span-1 mx-auto w-3/4 md:w-5/6"
        aria-label="Loading recipe card"
      />
    </>
  )
}
