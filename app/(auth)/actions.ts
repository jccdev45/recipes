"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/supabase/server"
import {
  englishDataset,
  englishRecommendedTransformers,
  RegExpMatcher,
} from "obscenity"

import { LoginSchema, RegisterSchema } from "@/lib/zod/schema"

// export const getURL = () => {
//   let url =
//     process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
//     process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
//     "http://localhost:3000/"
//   // Make sure to include `https://` when not localhost.
//   url = url.includes("http") ? url : `https://${url}`
//   // Make sure to include a trailing `/`.
//   url = url.charAt(url.length - 1) === "/" ? url : `${url}/`
//   return url
// }

// Initialize the obscenity matcher
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
})

// Helper function to check for profanity
const containsProfanity = (formData: FormData) => {
  for (const pair of formData.entries()) {
    if (matcher.hasMatch(pair[1] as string)) {
      return true
    }
  }
  return false
}

// Login function
export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  if (containsProfanity(formData)) {
    return {
      message: "Watch your profanity 🤬",
    }
  }

  const validatedFields = LoginSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      message: "There was an error",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error("Error: ", error.message)
    redirect("/error")
  }

  revalidatePath("/", "layout")
  redirect(`/profile/${user?.id}`)
}

// Signup function
export async function signup(formData: FormData) {
  const supabase = createClient()

  const values = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirm_password: formData.get("confirm_password") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
  }

  if (containsProfanity(formData)) {
    return {
      message: "Watch your profanity 🤬",
    }
  }

  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      message: "There was an error",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        first_name: values.first_name,
        last_name: values.last_name,
      },
    },
  })

  if (error) {
    console.error("Error: ", error.message)
    redirect("/error")
    // if (error.message.includes("already registered")) {
    //   return {
    //     message:
    //       "This email is already registered. Please use a different email.",
    //   }
    // }
    // return {
    //   message: "An unexpected error occurred. Please try again later.",
    // }
  }

  revalidatePath("/", "layout")
  redirect(`/profile/${user?.id}`)
}
