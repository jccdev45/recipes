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
    "Collection of signature family recipes. Expect lots of flavor and lots of love. Enjoy.",
  keywords: "nextjs, supabase, recipes, cooking",
  authors: [{ name: "jccdev", url: "https://jccdev.vercel.app" }],
  creator: "jccdev",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://family-recipes-v2.vercel.app",
    siteName: "Family Recipes",
    title: "Family Recipes",
    description:
      "Collection of signature family recipes. Expect lots of flavor and lots of love. Enjoy.",
    images: [
      {
        url: "https://nbwdildsbmoetwhe.public.blob.vercel-storage.com/export-7lFgmfoeSrP3pTNiP1GZVo0nf7S0ov.png",
        width: 1200,
        height: 630,
        alt: "Family Recipes OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Family Recipes",
    description:
      "Collection of signature family recipes. Expect lots of flavor and lots of love. Enjoy.",
    creator: "@jccdev",
    images: [
      "https://nbwdildsbmoetwhe.public.blob.vercel-storage.com/export-7lFgmfoeSrP3pTNiP1GZVo0nf7S0ov.png",
    ],
  },
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
          <div className="mx-auto flex min-h-screen max-w-screen-lg flex-col items-center justify-between gap-y-4 xl:max-w-screen-xl">
            <Nav />
            <main className="w-full max-w-6xl flex-1 grow gap-4">
              {children}
            </main>
            <Footer />
            <Toaster />
          </div>
        </AppProviders>
      </body>
    </html>
  )
}
