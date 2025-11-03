import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Tagline } from "@/components/landing/tagline"

import type { StaticImageData } from "next/image"
import type { ReactNode } from "react"

type HeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6"

interface FeatureAction {
  label: string
  href: string
  variant?: "default" | "ghost" | "outline"
  icon?: ReactNode
  ariaLabel?: string
}

interface FeatureSection1Props {
  id?: string
  tagline?: ReactNode
  title: string
  description?: ReactNode
  actions?: FeatureAction[]
  headingLevel?: HeadingLevel
  className?: string
  image?: {
    src: string | StaticImageData
    alt: string
    aspectRatio?: number
  }
}

export function FeatureSection({
  id,
  tagline,
  title,
  description,
  actions,
  headingLevel = "h2",
  className,
  image,
}: FeatureSection1Props) {
  const Heading = headingLevel

  return (
    <section
      className={cn("section-padding-y bg-background", className)}
      aria-labelledby={id}
    >
      <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 md:flex-row md:gap-16">
        <div className="flex flex-1 flex-col gap-8 lg:order-last">
          <div className="section-title-gap-lg flex flex-col items-start">
            {tagline ? <Tagline>{tagline}</Tagline> : null}
            <Heading id={id} className="heading-lg text-foreground">
              {title}
            </Heading>
            {description ? (
              <div className="text-muted-foreground">{description}</div>
            ) : null}
          </div>

          {actions && actions.length > 0 ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              {actions.map((action, index) => (
                <Button
                  key={action.label}
                  variant={
                    action.variant ?? (index === 0 ? "default" : "ghost")
                  }
                  asChild
                  aria-label={action.ariaLabel ?? action.label}
                >
                  <Link href={action.href}>
                    {action.label}
                    {action.icon ?? (index === 1 ? <ArrowRightIcon /> : null)}
                  </Link>
                </Button>
              ))}
            </div>
          ) : null}
        </div>

        {image ? (
          <div className="w-full flex-1 md:max-w-xl md:self-center lg:max-w-lg">
            <AspectRatio ratio={image.aspectRatio ?? 4 / 3}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="rounded-xl object-contain"
              />
            </AspectRatio>
          </div>
        ) : null}
      </div>
    </section>
  )
}
