import "./globals.css"

import { Lexend_Deca, Manrope } from "next/font/google"
import { AppProviders } from "@/context/root-providers"
import { Toaster } from "sonner"

import { cn } from "@/lib/utils"
import { Footer } from "@/components/footer"
import { Nav } from "@/components/nav"

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
          <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col items-center justify-between xl:max-w-screen-2xl">
            <Nav />
            <main className="w-full max-w-6xl flex-1 grow">{children}</main>
            <Toaster />
            <Footer className="w-full py-8" />
          </div>
        </AppProviders>
      </body>
    </html>
  )
}
