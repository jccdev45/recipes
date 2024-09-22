import "./globals.css"

import localFont from "next/font/local"
import { createClient } from "@/supabase/server"
import { Toaster } from "sonner"

import { cn } from "@/lib/utils"
import { Footer } from "@/components/footer"
import { MainNav } from "@/components/main-nav"

import { AppProviders } from "./providers"
import Searchbar from "./recipes/search"

const fontIBM = localFont({
  src: [
    {
      path: "../public/fonts/IBMPlexMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/IBMPlexMono-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/IBMPlexMono-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/IBMPlexMono-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/IBMPlexMono-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/IBMPlexMono-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/IBMPlexMono-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/IBMPlexMono-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../public/fonts/IBMPlexMono-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/IBMPlexMono-ExtraLightItalic.ttf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../public/fonts/IBMPlexMono-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/IBMPlexMono-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
  ],
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
      <body className={cn("relative min-h-screen", fontIBM.className)}>
        <AppProviders>
          <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col items-center justify-between xl:max-w-screen-2xl">
            <MainNav
              user={data.user}
              className="max-h-24 border-b-2 py-6 md:p-6"
            />
            <Searchbar className="my-2 flex w-5/6 items-center md:w-1/2" />
            <main className="w-full max-w-6xl flex-1 grow">{children}</main>
            <Toaster />
            <Footer className="w-full py-8" />
          </div>
        </AppProviders>
      </body>
    </html>
  )
}
