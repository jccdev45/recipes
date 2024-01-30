import { Suspense } from "react"
import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { getAll } from "@/supabase/helpers"
import { createClient } from "@/supabase/server"

import { Recipe } from "@/types/supabase"
import { shimmer, toBase64 } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  TypographyH1,
  TypographyH2,
  TypographyH4,
  TypographyLarge,
  TypographyP,
  TypographySmall,
} from "@/components/ui/typography"
import { RecipeCard } from "@/app/recipes/RecipeCard"

import CookingSvg from "/public/images/CookingSvg.svg"

export default async function Index() {
  const supabase = createClient(cookies())
  // const user = await getAuthUser(supabase)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const params = {
    order: {
      column: "id",
      options: { ascending: false },
    },
    limit: 3,
  }
  // TODO: CHANGE ONCE PROPER TYPING IS ADDED TO GETALL
  const data = (await getAll({ db: "recipes", params }, supabase)) as Recipe[]

  return (
    <section className="w-full">
      <div className="relative h-40 md:h-48 aspect-auto lg:h-64">
        <Image
          src="https://eebioglnufbnareanhqf.supabase.co/storage/v1/object/public/photos/banner-full.jpeg"
          alt="Medina Family Banner"
          fill
          priority
          // sizes="(max-width: 768px) 100vw"
          className="object-cover object-top lg:object-contain"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(
            shimmer(1000, 250)
          )}`}
        />
      </div>

      <div className="flex flex-col items-center px-4 py-10 md:justify-evenly md:py-14 md:flex-row gap-y-4 lg:gap-0">
        <div className="flex flex-col items-start justify-center w-full gap-2 px-8 my-6 md:w-1/3 md:my-0">
          <TypographyH1 className="rounded-md dark:bg-black/80 max-w-max">
            Welcome!
          </TypographyH1>
          <div>
            You like flavor, don't you?
            <TypographyLarge>Good!</TypographyLarge> You're in the right place.
          </div>
          <div className="w-full md:w-fit">
            {!user ? (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/recipes">Go to Recipes</Link>
              </Button>
            )}
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
      </div>

      <Separator className="w-5/6 h-2 mx-auto my-8 rounded-lg bg-foreground" />

      <div className="p-2">
        <TypographyH2 className="my-4 text-center">Get a taste:</TypographyH2>
        <div className="grid w-full grid-cols-1 gap-y-2 md:gap-x-1 md:grid-cols-3 ">
          <Suspense fallback={<RecipesFallback />}>
            {data?.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                className="w-11/12 col-span-1 mx-auto"
              />
            ))}
          </Suspense>
        </div>
      </div>
    </section>
  )
}

function RecipesFallback() {
  return (
    <>
      <Skeleton className="w-11/12 col-span-1 mx-auto"></Skeleton>
      <Skeleton className="w-11/12 col-span-1 mx-auto"></Skeleton>
      <Skeleton className="w-11/12 col-span-1 mx-auto"></Skeleton>
    </>
  )
}
