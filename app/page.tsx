import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { getAll } from "@/supabase/helpers"
import { createClient } from "@/supabase/server"

import { Recipe } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  TypographyH1,
  TypographyH2,
  TypographyLead,
  TypographyP,
} from "@/components/ui/typography"
import { RecipeCard } from "@/app/recipes/RecipeCard"

import CookingSvg from "/public/images/CookingSvg.svg"

export default async function Index() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const params = {
    order: {
      column: "id",
      options: { ascending: true },
    },
    limit: 3,
  }
  // TODO: CHANGE ONCE PROPER TYPING IS ADDED TO GETALL
  const data: Recipe[] | null = await getAll(
    { db: "recipes", params },
    supabase
  )

  return (
    <>
      <section className="flex flex-col items-center gap-y-4 px-4 py-10 md:flex-row md:justify-evenly md:py-14 lg:gap-0">
        <div className="my-6 flex w-full flex-col items-start justify-center gap-2 px-8 md:my-0 md:w-1/3">
          <TypographyH1 className="max-w-max rounded-md dark:bg-black/80">
            Welcome!
          </TypographyH1>
          <div className="w-full md:w-fit">
            {!user && (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
            <Button asChild>
              <Link href="/recipes">Go to Recipes</Link>
            </Button>
          </div>
        </div>
        <div className="w-5/6 rounded-full md:w-1/3">
          <Image
            src={CookingSvg}
            alt="Cartoon style depiction of man sitting on large chef hat, with spoon and salt/pepper shakers"
            width={300}
            height={300}
            className="contain"
          />
        </div>
      </section>

      <section className="w-full py-6 md:py-12 lg:py-16">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-2/3 space-y-2">
            <TypographyH2 className="text-center">
              Family Recipes,{" "}
              <span className="bg-gradient-to-r from-[#EF0000] from-10% via-black/10 via-20% to-[#004EF1] bg-clip-text text-transparent dark:via-white dark:to-[#004EF1]">
                Puerto Rican
              </span>{" "}
              style
            </TypographyH2>
            <div className="space-x-0 space-y-8 md:space-x-8">
              <TypographyP className="text-justify">
                Welcome to a collection of my family recipes, packed with just
                as much love as flavor. Inside, you'll find Puerto Rican
                classics like pernil and arroz con gandules but also everyday
                hits like chicken fingers and potato salad. There's a little
                something for everyone.
              </TypographyP>
              <TypographyLead className="text-center">
                You like flavor don't you? <strong>Good!</strong> <br /> You're
                in the right place.
              </TypographyLead>
            </div>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button asChild>
              <Link href="/recipes">View Recipes</Link>
            </Button>
            <Button asChild>
              <Link href="/recipes/add">Add Recipe</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="p-2">
        <TypographyH2 className="my-4 text-center">
          Featured recipes:
        </TypographyH2>
        <div className="grid w-full grid-cols-1 gap-y-2 md:grid-cols-3 md:gap-x-1">
          <Suspense fallback={<RecipesFallback />}>
            {data?.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                className="col-span-1 mx-auto w-3/4 md:w-5/6"
              />
            ))}
          </Suspense>
        </div>
      </section>
    </>
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
