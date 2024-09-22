import Image from "next/image"
import { redirect } from "next/navigation"
import { createClient } from "@/supabase/server"

import { GradientBanner } from "@/components/gradient-banner"
import { UserProfileForm } from "@/components/user-profile-form"
import { signup } from "@/app/(auth)/actions"

import AuthSvg from "/public/images/Login.svg"

export const metadata = {
  title: "Sign Up",
}

export default async function SignupPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect(`/profile/${user.id}`)
  }

  return (
    <>
      <GradientBanner />

      <section className="grid -translate-y-16 grid-cols-1 gap-4 p-8 md:-translate-y-32 md:px-16 lg:grid-cols-2">
        <Image
          src={AuthSvg}
          alt="Cartoon depiction of person standing on laptop with lock icon, representing logging in"
          className="order-last col-span-1 mx-auto w-5/6 lg:order-first"
          width={500}
          height={500}
        />

        <UserProfileForm title="Sign Up" formType="register" />
      </section>
    </>
  )
}
