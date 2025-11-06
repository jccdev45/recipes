import { InfoIcon, PauseCircle, TriangleAlert } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const ICONS = {
  info: <InfoIcon className="size-4" />,
  warning: <TriangleAlert className="size-4" />,
  pause: <PauseCircle className="size-4" />,
}

interface FormInfoALertProps {
  title: string
  desc: string
  type: keyof typeof ICONS
}

export function FormInfoAlert({ title, desc, type }: FormInfoALertProps) {
  return (
    <Alert className="border-primary/30 bg-primary/5 border-dashed">
      {ICONS[type]}
      <AlertTitle className="text-sm font-semibold">{title}</AlertTitle>
      <AlertDescription className="text-sm">{desc}</AlertDescription>
    </Alert>
  )
}
