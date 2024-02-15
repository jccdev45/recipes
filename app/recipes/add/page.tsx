import Cooking2 from "/public/images/Cooking2.svg";
import Image from "next/image";
import { redirect } from "next/navigation";

import { GradientBanner } from "@/components/GradientBanner";
import { createClient } from "@/supabase/server";

import { AddRecipeForm } from "./AddRecipeForm";
import { cookies } from "next/headers";

export default async function AddRecipePage() {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <section>
      <GradientBanner />

      <div className="grid grid-cols-1 px-4 -translate-y-20 gap-y-4 lg:gap-0 lg:grid-cols-5 lg:-translate-y-20">
        <AddRecipeForm
          className="grid order-last w-full max-w-4xl grid-cols-1 col-span-1 p-4 mx-auto lg:ml-auto md:col-span-3 lg:w-5/6"
          user={user}
        />

        <div className="col-span-1 md:col-span-2">
          <Image
            src={Cooking2}
            alt="Cartoonish depiction of two people whisking a bowl (not sure why it takes two but okay)"
            width={300}
            height={300}
            className="w-5/6 mx-auto translate-x-0 lg:translate-x-8 md:w-2/3"
          />
        </div>
      </div>
    </section>
  );
}
