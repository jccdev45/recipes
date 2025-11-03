import Image from "next/image"

import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Tagline } from "@/components/landing/tagline"

import type { StaticImageData } from "next/image"
import type { ReactNode } from "react"

type HeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6"

interface StatItem {
  id: string
  label: string
  value: ReactNode
  description?: ReactNode
}

interface StatsSection1Props {
  id?: string
  tagline?: ReactNode
  title: string
  description?: ReactNode
  stats: StatItem[]
  headingLevel?: HeadingLevel
  className?: string
  media?: {
    src: string | StaticImageData
    alt: string
    aspectRatio?: number
  }
}

export function StatsSection({
  id,
  tagline,
  title,
  description,
  stats,
  headingLevel = "h2",
  className,
  media,
}: StatsSection1Props) {
  const Heading = headingLevel

  return (
    <section
      className={cn("section-padding-y bg-background", className)}
      aria-labelledby={id}
    >
      <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
        <div className="flex flex-1 flex-col gap-10 md:gap-12">
          <div className="section-title-gap-lg flex flex-col">
            {tagline ? <Tagline>{tagline}</Tagline> : null}
            <Heading id={id} className="heading-lg text-foreground">
              {title}
            </Heading>
            {description ? (
              <div className="text-muted-foreground">{description}</div>
            ) : null}
          </div>

          <dl className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="border-border/60 bg-muted/10 flex flex-col gap-2 rounded-lg border p-5"
              >
                <dt className="text-muted-foreground text-sm font-medium">
                  {stat.label}
                </dt>
                <dd className="text-foreground text-3xl font-bold">
                  {stat.value}
                </dd>
                {stat.description ? (
                  <dd className="text-muted-foreground text-sm">
                    {stat.description}
                  </dd>
                ) : null}
              </div>
            ))}
          </dl>
        </div>

        {media ? (
          <div className="w-full flex-1 md:w-2/3 md:self-center lg:max-w-lg">
            <AspectRatio ratio={media.aspectRatio ?? 1}>
              <Image
                src={media.src}
                alt={media.alt}
                fill
                className="size-full rounded-xl object-contain"
              />
            </AspectRatio>
          </div>
        ) : null}
      </div>
    </section>
  )
}
