import Image from "next/image"
import { redirect } from "next/navigation"
import { createClient } from "@/supabase/server"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradientBanner } from "@/components/GradientBanner"
import { UserProfileForm } from "@/components/user-profile-form"
import { LoginForm } from "@/app/(auth)/login/login-form"

import AuthSvg from "/public/images/Login.svg"

export default async function LoginPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect(`/profile/${user.id}`)
  }

  return (
    <div className="h-full">
      <GradientBanner />

      <section className="grid -translate-y-16 grid-cols-1 gap-4 p-8 md:-translate-y-32 md:py-8 lg:grid-cols-2">
        <Image
          src={AuthSvg}
          alt="Cartoon depiction of person standing on laptop with lock icon, representing logging in"
          className="order-last col-span-1 mx-auto w-5/6 lg:order-first"
          width={500}
          height={500}
        />

        <Tabs defaultValue="login">
          <TabsList>
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <UserProfileForm title="Sign Up" formType="register" />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
