import { cookies } from "next/headers"
import Image from "next/image"
import { redirect } from "next/navigation"
import { getAuthUser } from "@/supabase/helpers"
import { createClient } from "@/supabase/server"

import { GradientBanner } from "@/components/GradientBanner"
import { RegisterForm } from "@/app/(auth)/login/RegisterForm"

import AccountInfoSvg from "/public/images/AccountInfo.svg"

export default async function EditProfilePage() {
  const supabase = createClient(cookies())
  const user = (await getAuthUser(supabase)) || null

  if (!user) {
    redirect("/login")
  }

  return (
    <section className="">
      <GradientBanner />

      <div className="grid -translate-y-[12%] grid-cols-1 gap-y-4 md:-translate-y-1/4 md:grid-cols-3 md:gap-0">
        <div className="relative -z-10 col-span-1 mx-auto hidden h-3/4 w-2/3 rounded-lg md:block md:w-5/6">
          <Image
            src={AccountInfoSvg}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw"
            alt="Cartoon depiction of person editing their profile information"
            className="mx-auto"
          />
        </div>

        <RegisterForm
          type="edit-profile"
          user={user}
          className="col-span-1 mx-auto flex w-5/6 flex-1 flex-col gap-2 p-4 md:col-span-2 md:w-3/4"
        />
      </div>
    </section>
  )
}
