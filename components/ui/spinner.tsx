import type { ComponentType, SVGProps } from "react"

import {
  Loader2Icon,
  LoaderIcon,
  LoaderPinwheelIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

type SpinnerSize = "sm" | "md" | "lg" | "xl" | "2xl"
type SpinnerIcon = "default" | "minimal" | "pinwheel"

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-10",
  "2xl": "size-12",
}

const iconMap: Record<SpinnerIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  default: Loader2Icon,
  minimal: LoaderIcon,
  pinwheel: LoaderPinwheelIcon,
}

type SpinnerProps = {
  size?: SpinnerSize
  icon?: SpinnerIcon
} & SVGProps<SVGSVGElement>

function Spinner({
  className,
  size = "md",
  icon = "default",
  role = "status",
  "aria-label": ariaLabel = "Loading",
  ...props
}: SpinnerProps) {
  const IconComponent = iconMap[icon] ?? iconMap.default

  return (
    <IconComponent
      role={role}
      aria-label={ariaLabel}
      className={cn("animate-spin", sizeClasses[size], className)}
      {...props}
    />
  )
}

export { Spinner }
