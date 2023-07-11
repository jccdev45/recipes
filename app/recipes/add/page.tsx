import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { AddRecipeForm } from "./AddRecipeForm";

export default async function AddRecipePage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AddRecipeForm user={user} />;
}
