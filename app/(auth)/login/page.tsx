import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfileForm } from "@/components/user-profile-form"
import { getUser } from "@/app/(auth)/actions"
import { LoginForm } from "@/app/(auth)/login/login-form"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login",
  description:
    "Log in to your Family Recipes account to access and manage your recipes.",
}

export default async function LoginPage() {
  const { user } = await getUser()

  if (user) {
    redirect(`/profile/${user.id}`)
  }

  return (
    <div className="bg-muted/40">
      <div className="container flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-5xl overflow-hidden border-none shadow-lg">
          <CardContent className="grid items-start gap-0 p-0 md:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col gap-8 p-6 sm:p-10 md:p-12">
              <div className="space-y-3 text-center md:text-left">
                <p className="text-primary text-xs font-semibold tracking-wide uppercase">
                  Family Recipes
                </p>
                <h1 className="text-3xl font-semibold sm:text-4xl">
                  Keep cooking together
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Sign in to manage your saved recipes or create an account to
                  start collecting family favorites.
                </p>
              </div>

              <Tabs defaultValue="login" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 rounded-none bg-transparent p-0 text-sm">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:border-primary data-[state=active]:text-primary rounded-none border-b-2 border-transparent px-3 py-2 font-medium"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:border-primary data-[state=active]:text-primary rounded-none border-b-2 border-transparent px-3 py-2 font-medium"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <LoginForm className="mt-1" />
                  <p className="text-muted-foreground text-center text-xs md:text-left">
                    By continuing, you agree to our{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Terms of Service (opens in a new tab)"
                      className="text-primary focus-visible:outline-primary underline focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Privacy Policy (opens in a new tab)"
                      className="text-primary focus-visible:outline-primary underline focus-visible:outline focus-visible:outline-offset-2"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </TabsContent>
                <TabsContent value="signup" className="space-y-4">
                  <UserProfileForm
                    title="Create your account"
                    formType="register"
                    className="mt-1"
                  />
                  <p className="text-muted-foreground text-center text-xs md:text-left">
                    Have an account already? Switch to the login tab to sign in.
                  </p>
                </TabsContent>
              </Tabs>
            </div>

            <div className="relative hidden self-start overflow-hidden md:block md:min-h-112">
              <Image
                src="/images/Login.svg"
                alt="Illustration of a person securing access on a laptop"
                fill
                priority
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-contain p-10"
              />
              <div className="from-background/90 via-background/40 pointer-events-none absolute inset-0 bg-linear-to-t to-transparent" />
              <div className="bg-background/85 absolute right-8 bottom-8 left-8 space-y-3 rounded-lg p-6 shadow-lg backdrop-blur">
                <p className="text-sm font-semibold">
                  Swap family favorites in seconds
                </p>
                <p className="text-muted-foreground text-sm">
                  Save treasured recipes, add your own twists, and share them
                  with the people you love most.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
