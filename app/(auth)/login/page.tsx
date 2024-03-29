import Image from "next/image"

import { GradientBanner } from "@/components/GradientBanner"
import { LoginForm } from "@/app/(auth)/login/login-form"

import AuthSvg from "/public/images/Login.svg"

export default async function LoginPage() {
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

        <LoginForm />
      </section>
    </div>
  )
}
