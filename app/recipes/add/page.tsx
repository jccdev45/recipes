import Cooking2 from "/public/images/Cooking2.svg";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import { GradientBanner } from "@/components/GradientBanner";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { AddRecipeForm } from "./AddRecipeForm";

export default async function AddRecipePage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <section>
      <GradientBanner />

      <div className="grid grid-cols-1 px-4 -translate-y-20 gap-y-4 md:gap-0 md:grid-cols-5 md:-translate-y-20">
        <AddRecipeForm
          className="grid order-last w-5/6 max-w-4xl grid-cols-1 col-span-1 p-4 mx-auto md:col-span-3 md:order-first"
          user={user}
        />

        <div className="col-span-1 md:col-span-2">
          <Image
            src={Cooking2}
            alt="Cartoonish depiction of two people whisking a bowl (not sure why it takes two but okay)"
            width={300}
            height={300}
            className="w-5/6 mx-auto translate-x-8 md:w-full md:translate-x-0"
          />
        </div>
      </div>
    </section>
  );
}
