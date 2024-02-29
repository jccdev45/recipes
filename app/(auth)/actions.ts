"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/supabase/server"
import {
  englishDataset,
  englishRecommendedTransformers,
  RegExpMatcher,
} from "obscenity"

import { LoginSchema, RegisterSchema } from "@/lib/zod/schema"

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/"
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`
  return url
}

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
})

export async function login(prevState: any, formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // TODO: in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const validatedFields = LoginSchema.safeParse(data)

  for (const pair of formData.entries()) {
    const hasMatch = matcher.hasMatch(pair[1] as string)

    if (hasMatch) {
      return {
        message: "Watch your profamity 🤬",
      }
    }
  }

  if (!validatedFields.success) {
    return {
      message: "There was an error",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error("Error: ", error.message)

    redirect("/error")
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // TODO: in practice, you should validate your inputs
  const values = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirm_password: formData.get("confirm_password") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    // avatar_url:
    //     imgURL.length > 0
    //       ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${imgURL}`
    //       : `http://loremflickr.com/g/500/500/user`,
    // options: {
    //   data: {
    //   },
    // },
  }

  const validatedFields = RegisterSchema.safeParse(values)

  for (const pair of formData.entries()) {
    const hasMatch = matcher.hasMatch(pair[1] as string)

    if (hasMatch) {
      return {
        message: "Watch your profamity 🤬",
      }
    }
  }

  if (!validatedFields.success) {
    return {
      message: "There was an error",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      emailRedirectTo: getURL(),
      data: {
        first_name: values.first_name,
        last_name: values.last_name,
        // avatar_url: values.avatar_url,
      },
    },
  })

  if (error) {
    console.error("Error: ", error.message)

    redirect("/error")
  }

  revalidatePath("/success", "page")
  redirect("/success")
}
