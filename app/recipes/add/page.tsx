import Image from "next/image"
import { redirect } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Typography } from "@/components/ui/typography"
import { getUser } from "@/app/(auth)/actions"
import { AddRecipeForm } from "@/app/recipes/add/add-recipe-form"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Add Recipe",
  description:
    "Share your favorite family recipe with our community by adding it to our collection.",
}

export default async function AddRecipePage() {
  const { user } = await getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <section
      aria-labelledby="add-recipe-heading"
      className="mx-auto max-w-6xl space-y-12 px-4 pt-6 pb-16 sm:px-6 lg:px-8"
    >
      <a
        href="#add-recipe-form"
        className="focus-visible:bg-background sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-6 focus-visible:left-6 focus-visible:rounded-md focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:shadow-lg"
      >
        Skip to recipe form
      </a>

      <div className="from-primary/15 via-background to-background relative overflow-hidden rounded-3xl border bg-linear-to-br shadow-lg">
        <div
          className="bg-primary/30 pointer-events-none absolute top-10 -right-20 h-72 w-72 rounded-full blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-60 w-60 rounded-full bg-amber-300/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative grid gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[minmax(0,1.35fr)_1fr] lg:items-center">
          <div className="space-y-6">
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary w-fit"
            >
              Community Cookbook
            </Badge>
            <Typography
              variant="h1"
              id="add-recipe-heading"
              className="text-foreground text-3xl leading-tight font-semibold sm:text-4xl md:text-5xl"
            >
              Share a recipe that brings people together
            </Typography>
            <Typography className="text-muted-foreground max-w-xl text-base sm:text-lg">
              Tell the story behind your signature dish, organize your
              ingredients with smart helpers, and publish a polished recipe in
              minutes. We will keep everything responsive and accessible for the
              whole community.
            </Typography>

            <ul className="text-muted-foreground grid gap-4 sm:grid-cols-2">
              {[
                "Guided sections for ingredients, steps, and tags",
                "Quick keyboard navigation with focused controls",
                "Auto-generated slugs based on your title",
                "Support for vivid imagery when you are ready",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm sm:text-base"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="text-primary mt-1 h-5 w-5"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto h-64 w-full max-w-sm sm:h-72 lg:h-80">
            <Image
              src="/images/Cooking2.svg"
              alt="Illustration of two people whisking batter together in a mixing bowl."
              fill
              sizes="(max-width: 1024px) 60vw, 360px"
              priority
              className="object-contain drop-shadow-xl select-none"
            />
          </div>
        </div>
      </div>

      <AddRecipeForm className="mx-auto w-full" user={user} />
    </section>
  )
}
