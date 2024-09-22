"use client"

import { Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"
import { login } from "@/app/(auth)/actions"

interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  action: typeof login
  className?: string
}

export function AuthButton({ className, label, action }: AuthButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      aria-disabled={pending}
      disabled={pending}
      className={className}
      formAction={action}
    >
      {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
      {label}
    </Button>
  )
}
