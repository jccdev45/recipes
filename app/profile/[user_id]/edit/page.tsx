import Image from "next/image"
import { redirect } from "next/navigation"
import { createClient } from "@/supabase/server"

import { GradientBanner } from "@/components/GradientBanner"
import { UserProfileForm } from "@/components/user-profile-form"
import { AccountForm } from "@/app/profile/[user_id]/edit/account-form"

import AccountInfoSvg from "/public/images/AccountInfo.svg"

export default async function EditProfilePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <>
      <GradientBanner />

      <section className="grid -translate-y-16 grid-cols-1 gap-4 p-8 md:-translate-y-32 md:px-16 lg:grid-cols-2">
        <Image
          src={AccountInfoSvg}
          width={500}
          height={500}
          alt="Cartoon depiction of person editing their profile information"
          className="order-last col-span-1 mx-auto w-5/6 lg:order-first"
        />

        {/* <UserProfileForm title="Edit Profile" formType="edit" userData={user} /> */}
        <AccountForm user={user} />
      </section>
    </>
  )
}
