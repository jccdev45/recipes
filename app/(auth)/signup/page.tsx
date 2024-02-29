import Image from "next/image"
import Link from "next/link"

import { registerFormItems } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TypographyH2 } from "@/components/ui/typography"
import { GradientBanner } from "@/components/GradientBanner"
import { signup } from "@/app/(auth)/actions"
import { AuthButton } from "@/app/(auth)/auth-button"
import { SignupForm } from "@/app/(auth)/signup/signup-form"

import AuthSvg from "/public/images/Login.svg"

export default async function SignupPage() {
  return (
    <div className="h-full">
      <GradientBanner />

      <section className="grid -translate-y-16 grid-cols-1 gap-4 p-8 md:-translate-y-32 md:px-16 lg:grid-cols-2">
        <Image
          src={AuthSvg}
          alt="Cartoon depiction of person standing on laptop with lock icon, representing logging in"
          className="order-last col-span-1 mx-auto w-5/6 lg:order-first"
          width={500}
          height={500}
        />

        <SignupForm />
      </section>
    </div>
  )
}
