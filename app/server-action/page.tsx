// TODO: Duplicate or move this file outside the `_examples` folder to make it a route

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function ServerAction() {
  const addRecipe = async (formData: FormData) => {
    "use server";
    const recipeName = formData.get("recipeName");

    if (recipeName) {
      // Create a Supabase client configured to use cookies
      const supabase = createServerActionClient({ cookies });

      // This assumes you have a `todos` table in Supabase. Check out
      // the `Create Table and seed with data` section of the README 👇
      // https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md
      await supabase.from("recipes").insert({ recipeName });
      revalidatePath("/server-action-example");
    }
  };

  return (
    <form action={addRecipe}>
      <input name="title" />
    </form>
  );
}
