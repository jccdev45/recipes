"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/supabase/server"
import {
  englishDataset,
  englishRecommendedTransformers,
  RegExpMatcher,
} from "obscenity"

import {
  EditProfileSchema,
  LoginSchema,
  RegisterSchema,
} from "@/lib/zod/schema"

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/"
  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`
  return url
}

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
  const supabase = await createClient()

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

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    console.error("Error: ", error.message)
    redirect(`/auth-error?message=${error.message}`)
  }

  revalidatePath("/", "layout")
  redirect(`/`)
}

// Signup function
export async function signup(formData: FormData) {
  const supabase = await createClient()

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
      emailRedirectTo: getURL(),
    },
  })

  if (error) {
    console.error("Error: ", error.message)
    redirect(`/auth-error?message=${error.message}`)
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error: ", error.message)
    redirect(`/auth-error?message=${error.message}`)
  }

  revalidatePath("/", "layout")
  redirect(`/`)
}

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return { user, error }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  if (containsProfanity(formData)) {
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
  }

  const validatedFields = EditProfileSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      message: "There was an error",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const updateData: {
    email?: string
    password?: string
    data?: {
      first_name?: string
      last_name?: string
    }
  } = {}

  if (values.email) updateData.email = values.email
  if (values.password) updateData.password = values.password
  if (values.first_name)
    updateData.data = { ...updateData.data, first_name: values.first_name }
  if (values.last_name)
    updateData.data = { ...updateData.data, last_name: values.last_name }

  const { data, error } = await supabase.auth.updateUser(updateData)

  if (error) {
    console.error("Error: ", error.message)
    redirect(`/auth-error?message=${error.message}`)
  }

  revalidatePath("/", "layout")
  redirect("/")
}
