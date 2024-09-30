import * as React from "react"
import { cva } from "class-variance-authority"
import { Ellipsis, Loader, Loader2, LoaderPinwheel } from "lucide-react"

import { cn } from "@/lib/utils"

import type { VariantProps } from "class-variance-authority"

const spinnerVariants = cva("animate-spin text-primary", {
  variants: {
    variant: {
      default: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      muted: "text-muted-foreground",
    },
    size: {
      default: "size-8",
      sm: "size-6",
      lg: "size-10",
      xl: "size-14",
      "2xl": "size-20",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

export interface SpinnerProps
  extends React.HTMLAttributes<SVGElement>,
    VariantProps<typeof spinnerVariants> {
  icon?: "default" | "ellipsis" | "pinwheel" | "loader"
}

const iconMap = {
  default: Loader2,
  ellipsis: Ellipsis,
  pinwheel: LoaderPinwheel,
  loader: Loader,
}

function Spinner({
  className,
  variant,
  size,
  icon = "default",
  ...props
}: SpinnerProps) {
  const SpinnerIcon = iconMap[icon]

  return (
    <SpinnerIcon
      className={cn(spinnerVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Spinner, spinnerVariants }
