import Image from "next/image"
import { redirect } from "next/navigation"
import { getRecipes } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/server"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"

import { Typography } from "@/components/ui/typography"
import { GradientBanner } from "@/components/gradient-banner"
import { getUser } from "@/app/(auth)/actions"
import { AddRecipeForm } from "@/app/recipes/add/add-recipe-form"

import Cooking2 from "/public/images/Cooking2.svg"

export const metadata = {
  title: "Add Recipe",
}

export default async function AddRecipePage() {
  const { user } = await getUser()
  const queryClient = new QueryClient()
  const supabase = createClient()

  if (!user) {
    redirect("/login")
  }

  await prefetchQuery(queryClient, getRecipes(supabase))

  return (
    <section>
      <GradientBanner />

      <div className="grid -translate-y-20 grid-cols-1 px-4 lg:-translate-y-20 lg:gap-0">
        <div className="grid grid-cols-2 bg-muted p-2 md:py-4">
          <Typography variant="h1" className="m-auto text-2xl md:text-3xl">
            Add Recipe
          </Typography>
          <Image
            src={Cooking2}
            alt="Cartoonish depiction of two people whisking a bowl (not sure why it takes two but okay). The person on the right is holding the bowl and the one on the left is whisking it. You could argue they're showing the other how to do it but like, I wouldn't show someone while they were holding the bowl because that sounds like a quick way for the bowl to be dropped. Hopefully one day the truth comes to light."
            width={100}
            height={100}
            className="mx-auto w-5/6 translate-x-0 md:w-2/3 lg:translate-x-8"
          />
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <AddRecipeForm
            className="order-last col-span-1 mx-auto grid w-full grid-cols-1 gap-y-6 p-4 md:col-span-3 lg:ml-auto"
            user={user}
          />
        </HydrationBoundary>

        {/* <div className="col-span-1 md:col-span-2">
          <Image
            src={Cooking2}
            alt="Cartoonish depiction of two people whisking a bowl (not sure why it takes two but okay)"
            width={300}
            height={300}
            className="w-5/6 mx-auto translate-x-0 md:w-2/3 lg:translate-x-8"
          />
        </div> */}
      </div>
    </section>
  )
}
