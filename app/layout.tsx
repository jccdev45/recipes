import "./globals.css"

import { Darker_Grotesque as FontDG } from "next/font/google"
import { createClient } from "@/supabase/server"
import { Toaster } from "sonner"

import { cn } from "@/lib/utils"
import { Footer } from "@/components/Footer"
import { MainNav } from "@/components/MainNav"

import { AppProviders } from "./providers"
import Searchbar from "./recipes/Search"

const fontDG = FontDG({
  subsets: ["latin"],
})

export const metadata = {
  title: "Family Recipes",
  description:
    "Collection of signature recipes from the Medina Collective. Expect lots of flavor and lots of love. Enjoy.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  // if (error || !data?.user) {
  //   redirect("/")
  // }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("relative min-h-screen antialiased", fontDG.className)}
      >
        <AppProviders>
          <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col justify-between xl:max-w-screen-2xl">
            <MainNav
              user={data.user}
              className="mx-auto max-h-24 w-full border-b-2 py-6 md:p-6"
            />
            <Searchbar className="mx-auto my-2 flex w-5/6 items-center md:w-1/2" />
            <main className="flex-1 grow">{children}</main>
            <Toaster />
            <Footer className="w-full py-8" />
          </div>
        </AppProviders>
      </body>
    </html>
  )
}
