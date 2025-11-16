import Link from "next/link"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tagline } from "@/components/landing/tagline"

import type { ReactNode } from "react"

interface CtaSection1Props {
  id?: string
  tagline?: ReactNode
  title: string
  description?: ReactNode
  action: {
    label: string
    href: string
    ariaLabel?: string
    icon?: ReactNode
  }
  className?: string
}

export function CtaSection({
  id,
  tagline,
  title,
  description,
  action,
  className,
}: CtaSection1Props) {
  return (
    <section
      className={cn("section-padding-y bg-primary", className)}
      aria-labelledby={id}
    >
      <div className="container-padding-x container mx-auto">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-8 text-center md:gap-10">
          <div className="section-title-gap-lg mx-auto flex flex-col items-center">
            {tagline ? (
              <Tagline className="text-primary-foreground/80">
                {tagline}
              </Tagline>
            ) : null}
            <h2 id={id} className="heading-lg text-primary-foreground">
              {title}
            </h2>
            {description ? (
              <div className="text-primary-foreground/80">{description}</div>
            ) : null}
          </div>

          <Button
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/80"
            asChild
            aria-label={action.ariaLabel ?? action.label}
          >
            <Link href={action.href}>
              {action.label}
              {action.icon ?? <ArrowRightIcon />}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
