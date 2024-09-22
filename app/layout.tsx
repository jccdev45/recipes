import "./globals.css"

import { Lexend_Deca, Manrope } from "next/font/google"
import { createClient } from "@/supabase/server"
import { Toaster } from "sonner"

import { cn } from "@/lib/utils"
import { Footer } from "@/components/footer"
import { MainNav } from "@/components/main-nav"
import { AppProviders } from "@/app/providers"
import { Searchbar } from "@/app/recipes/search"

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" })
const lexend = Lexend_Deca({
  subsets: ["latin"],
  variable: "--font-lexend-deca",
})

export const metadata = {
  title: {
    template: "%s | Family Recipes",
    default: "Family Recipes",
  },
  description:
    "Collection of signature recipes from the Medina Collective. Expect lots of flavor and lots of love. Enjoy.",
  keywords: "nextjs, supabase, recipes, cooking",
  author: "jccdev",
  creator: "Jordan Cruz-Correa",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error(error)
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "relative min-h-screen",
          lexend.variable,
          manrope.variable
        )}
      >
        <AppProviders>
          <div className="flex flex-col items-center justify-between max-w-screen-xl min-h-screen mx-auto xl:max-w-screen-2xl">
            <MainNav
              user={data.user}
              className="py-6 border-b-2 max-h-24 md:p-6"
            />
            <Searchbar className="flex items-center w-5/6 my-2 md:w-1/2" />
            <main className="flex-1 w-full max-w-6xl grow">{children}</main>
            <Toaster />
            <Footer className="w-full py-8" />
          </div>
        </AppProviders>
      </body>
    </html>
  )
}
