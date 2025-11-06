import { ReactNode } from "react"
import { XCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FormErrorDisplayProps {
  error: string | null
  title: string
  children: ReactNode
}

export function ErrorDisplay({
  error,
  title,
  children,
}: FormErrorDisplayProps) {
  if (!error) return

  return (
    <Alert
      variant="destructive"
      className="border-destructive/40 bg-destructive/10"
    >
      <XCircle className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
      {children}
    </Alert>
  )
}
