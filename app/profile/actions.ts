"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { checkProfamity } from "@/supabase/helpers"
import { createClient } from "@/supabase/server"

import { RegisterSchema } from "@/lib/zod/schema"

export async function updateProfile(formData: FormData) {
  const supabase = createClient()

  if (checkProfamity(formData)) {
    return {
      message: "Watch your profamity 🤬",
    }
  }

  const values = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirm_password: formData.get("confirm_password") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    // avatar_url: ''
  }

  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      message: "There was an error",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  console.log(values)

  const { data, error } = await supabase.auth.updateUser({
    email: values.email,
    password: values.password,
    data: {
      first_name: values.first_name,
      last_name: values.last_name,
      // avatar_url: ''
    },
  })

  if (error) {
    console.error("Error: ", error.message)

    redirect("/error")
  }

  revalidatePath(`/profile/${data.user.id}`, "page")
  redirect(`/profile/${data.user.id}`)
}
