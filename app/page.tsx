import { Metadata } from "next"
import { getLandingHighlights } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/server"

import { Hero } from "@/components/hero"
import { BlogSection } from "@/components/landing/blog-section"
import { CtaSection } from "@/components/landing/cta-section"
import { FeatureSection } from "@/components/landing/feature-section"
import { FeaturedRecipes } from "@/components/landing/featured-recipes"
import { StatsSection } from "@/components/landing/stats-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"

export const metadata: Metadata = {
  title: "Family Recipes | Cook Together",
  description:
    "Discover and share beloved family recipes, spotlight featured dishes, and keep treasured flavors alive.",
  keywords: [
    "family recipes",
    "puerto rican cooking",
    "community cookbook",
    "share recipes",
    "home cooking",
  ],
  openGraph: {
    title: "Family Recipes",
    description:
      "Cook, collect, and celebrate the meals that tell your story. Explore featured dishes and community stats.",
    url: "https://family-recipes-v2.vercel.app",
    type: "website",
    images: [
      {
        url: "https://nbwdildsbmoetwhe.public.blob.vercel-storage.com/export-7lFgmfoeSrP3pTNiP1GZVo0nf7S0ov.png",
        width: 1200,
        height: 630,
        alt: "Family Recipes hero preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Family Recipes",
    description:
      "Discover and share beloved recipes passed down through generations.",
    creator: "@jccdev",
    images: [
      "https://nbwdildsbmoetwhe.public.blob.vercel-storage.com/export-7lFgmfoeSrP3pTNiP1GZVo0nf7S0ov.png",
    ],
  },
}

const numberFormatter = new Intl.NumberFormat()

const VIDEOS =
  process.env.NODE_ENV !== "production"
    ? ["/sample.mp4"]
    : [
        "https://nbwdildsbmoetwhe.public.blob.vercel-storage.com/onions-3ijkNNkNxCqwI6UYiQH3sGqk3j3GAV.mp4",
        "https://nbwdildsbmoetwhe.public.blob.vercel-storage.com/chef-PRV97AEi58qcIHRNaoZQdleB4V0KBW.mp4",
        "https://nbwdildsbmoetwhe.public.blob.vercel-storage.com/parsley-iRI1DTpoGcbhUZsbSjAnRHFRX5SvC5.mp4",
        "https://nbwdildsbmoetwhe.public.blob.vercel-storage.com/tomatoes-bznteJ2SHPEQ2S5N4AhshLGytkfQH7.mp4",
      ]

export default async function Index() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { recipes, stats } = await getLandingHighlights(supabase, {
    favoriteUserId: user?.id ?? undefined,
  })

  const statsItems = [
    {
      id: "total",
      label: "Recipes shared",
      value: numberFormatter.format(stats.totalRecipes),
      description: "Family-approved dishes collected in one welcoming kitchen.",
    },
    {
      id: "contributors",
      label: "Home cooks contributing",
      value: numberFormatter.format(stats.contributorCount),
      description: "Voices keeping beloved flavors alive across generations.",
    },
    {
      id: "tags",
      label: "Flavor tags to explore",
      value: numberFormatter.format(stats.tagCount),
      description: "Browse by ingredients, celebrations, and cooking styles.",
    },
    {
      id: "featured",
      label: "Featured this week",
      value: numberFormatter.format(stats.featuredCount),
      description: "A sampling of recipes getting extra love right now.",
    },
  ]

  return (
    <>
      <Hero
        type="video"
        videoSources={VIDEOS}
        title="Welcome!"
        subtitle="Discover and share beloved recipes passed down through generations"
        ctaText="Explore Recipes"
        ctaLink="/recipes"
      />

      <FeatureSection
        id="family-recipes"
        tagline="Family favorites"
        title="Cook, collect, and celebrate the meals that tell your story"
        description={
          "Keep treasured Puerto Rican dishes alongside new family staples so everyone can recreate them with confidence."
        }
        actions={[
          { label: "Browse recipes", href: "/recipes" },
          {
            label: "Share a recipe",
            href: "/recipes/add",
            ariaLabel: "Share a family recipe",
          },
        ]}
        image={{
          src: "/images/Cooking2.svg",
          alt: "Illustration of a person preparing a meal",
          aspectRatio: 4 / 3,
        }}
      />

      <StatsSection
        id="community-stats"
        tagline="Community at a glance"
        title="A growing table of shared dishes"
        description="Every contribution keeps traditions vibrant. Here's a quick snapshot of the flavors you can explore."
        stats={statsItems}
        media={{
          src: "/images/CookingSvg.svg",
          alt: "Colorful spread of ingredients on a counter",
        }}
      />

      <BlogSection
        id="featured-recipes-heading"
        title="Featured recipes"
        tagline="Weekly highlights"
        description="Hand-picked dishes to inspire your next meal."
        className="bg-secondary/5"
      >
        <FeaturedRecipes recipes={recipes} user={user ?? null} />
      </BlogSection>

      <TestimonialsSection />

      <CtaSection
        id="join-the-table"
        tagline="Pass it on"
        title="Share the dish that friends always request"
        description="Upload a favorite, add photos, and capture the story behind every bite."
        action={{
          label: "Contribute a recipe",
          href: "/recipes/add",
          ariaLabel: "Contribute a new recipe",
        }}
      />
    </>
  )
}
