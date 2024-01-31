import "./globals.css"

import { cookies } from "next/headers"
import { getAuthUser } from "@/supabase/helpers"
import { createClient } from "@/supabase/server"
import { Toaster } from "sonner"

import { Footer } from "@/components/Footer"
import { MainNav } from "@/components/MainNav"

import { AppProviders } from "./providers"
import Searchbar from "./recipes/Search"

export const metadata = {
  title: "Medina Recipes",
  description:
    "Collection of signature recipes from the Medina Collective. Expect lots of flavor and lots of love. Enjoy.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient(cookies())
  const user = (await getAuthUser(supabase)) || null

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative min-h-screen">
        <AppProviders>
          <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col justify-between">
            <MainNav
              user={user}
              className="mx-auto max-h-24 shrink py-6 md:p-6"
            />
            <Searchbar className="mx-auto my-2 flex w-5/6 items-center md:w-1/2" />
            <main className="flex-1">{children}</main>
            <Toaster />
            <Footer className="w-full py-8" />
          </div>
        </AppProviders>
      </body>
    </html>
  )
}
