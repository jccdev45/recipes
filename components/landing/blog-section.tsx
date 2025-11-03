import { cn } from "@/lib/utils"
import { Tagline } from "@/components/landing/tagline"

import type { ReactNode } from "react"

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

interface BlogSection1Props {
  id?: string
  title: string
  description?: ReactNode
  tagline?: ReactNode
  className?: string
  headingLevel?: HeadingLevel
  children: ReactNode
}

export function BlogSection({
  id = "blog-section-heading",
  title,
  description,
  tagline,
  className,
  headingLevel = "h2",
  children,
}: BlogSection1Props) {
  const Heading = headingLevel

  return (
    <section
      className={cn("section-padding-y bg-background", className)}
      aria-labelledby={id}
    >
      <div className="container-padding-x container mx-auto gap-10 md:gap-12">
        <div className="flex flex-col items-center gap-10 md:gap-12">
          <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center">
            {tagline ? <Tagline>{tagline}</Tagline> : null}
            <Heading id={id} className="heading-lg">
              {title}
            </Heading>
            {description ? (
              <div className="text-muted-foreground">{description}</div>
            ) : null}
          </div>

          <div
            className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
