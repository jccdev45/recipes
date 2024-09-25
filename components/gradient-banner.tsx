import { cn } from "@/lib/utils"
import { Typography } from "@/components/ui/typography"

type GradientVariant = "primary" | "secondary" | "accent" | "custom"
type BannerSize = "sm" | "md" | "lg"

interface GradientBannerProps {
  text?: string
  variant?: GradientVariant
  size?: BannerSize
  customStart?: string
  customEnd?: string
  textColor?: string
  pattern?: boolean
}

const gradientVariants: Record<Exclude<GradientVariant, "custom">, string> = {
  primary: "bg-gradient-to-r from-blue-500 to-purple-500",
  secondary: "bg-gradient-to-r from-green-400 to-blue-500",
  accent: "bg-gradient-to-r from-red-500 to-yellow-500",
}

const sizeVariants: Record<BannerSize, string> = {
  sm: "h-24 md:h-32",
  md: "h-32 md:h-52",
  lg: "h-40 md:h-64",
}

export function GradientBanner({
  text,
  variant = "primary",
  size = "lg",
  customStart,
  customEnd,
  textColor = "text-white",
  pattern = false,
}: GradientBannerProps) {
  const gradientClass =
    variant === "custom" && customStart && customEnd
      ? `bg-gradient-to-r ${customStart} ${customEnd}`
      : gradientVariants[variant as keyof typeof gradientVariants]

  return (
    <div
      className={cn(
        "relative w-full rounded-sm",
        gradientClass,
        sizeVariants[size]
      )}
    >
      {pattern && (
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="small-grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#small-grid)" />
          </svg>
        </div>
      )}
      {text && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Typography
            variant="h1"
            className={cn("text-center font-bold", textColor)}
          >
            {text}
          </Typography>
        </div>
      )}
    </div>
  )
}
