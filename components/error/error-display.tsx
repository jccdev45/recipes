import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react"
import { XCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type AlertProps = ComponentPropsWithoutRef<typeof Alert>

interface ErrorDisplayProps extends AlertProps {
  error?: string | null
  title: string
  children?: ReactNode
}

export const ErrorDisplay = forwardRef<HTMLDivElement, ErrorDisplayProps>(
  ({ error, title, children, className, ...alertProps }, ref) => {
    if (!error) return null

    return (
      <Alert
        ref={ref}
        variant="destructive"
        className={cn("border-destructive/40 bg-destructive/10", className)}
        {...alertProps}
      >
        <XCircle className="size-4" aria-hidden="true" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        {children}
      </Alert>
    )
  }
)

ErrorDisplay.displayName = "ErrorDisplay"
