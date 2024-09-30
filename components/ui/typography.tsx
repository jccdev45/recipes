import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

import type { VariantProps } from "class-variance-authority"

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl",
      h2: "pb-2 text-3xl font-semibold tracking-tight transition-colors border-b scroll-m-20 first:mt-0",
      h3: "text-2xl font-semibold tracking-tight scroll-m-20",
      h4: "text-xl font-semibold tracking-tight scroll-m-20",
      large: "text-lg font-semibold",
      lead: "text-xl text-muted-foreground",
      muted: "text-sm text-muted-foreground",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      blockquote: "pl-6 mt-6 italic border-l-2",
      small: "text-sm font-medium leading-none",
      list: "my-6 md:ml-6 list-disc [&>li]:mt-2",
      error: "text-destructive font-medium",
    },
  },
  defaultVariants: {
    variant: "p",
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {}

const variantElementMap: Record<
  NonNullable<TypographyProps["variant"]>,
  keyof JSX.IntrinsicElements
> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  large: "div",
  lead: "p",
  muted: "p",
  p: "p",
  blockquote: "blockquote",
  small: "small",
  list: "ul",
  error: "p",
}

function Typography({ className, variant, ...props }: TypographyProps) {
  const Comp = variant ? variantElementMap[variant] : "p"
  return React.createElement(Comp, {
    className: cn(typographyVariants({ variant, className })),
    ...props,
  })
}

export { Typography, typographyVariants }
