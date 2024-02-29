import Image from "next/image"
import { redirect } from "next/navigation"
import { createClient } from "@/supabase/server"

import { GradientBanner } from "@/components/GradientBanner"

import { AddRecipeForm } from "./AddRecipeForm"
import Cooking2 from "/public/images/Cooking2.svg"

export default async function AddRecipePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <section>
      <GradientBanner />

      <div className="grid -translate-y-20 grid-cols-1 gap-y-4 px-4 lg:-translate-y-20 lg:grid-cols-5 lg:gap-0">
        <AddRecipeForm
          className="order-last col-span-1 mx-auto grid w-full max-w-4xl grid-cols-1 p-4 md:col-span-3 lg:ml-auto lg:w-5/6"
          user={user}
        />

        <div className="col-span-1 md:col-span-2">
          <Image
            src={Cooking2}
            alt="Cartoonish depiction of two people whisking a bowl (not sure why it takes two but okay)"
            width={300}
            height={300}
            className="mx-auto w-5/6 translate-x-0 md:w-2/3 lg:translate-x-8"
          />
        </div>
      </div>
    </section>
  )
}
