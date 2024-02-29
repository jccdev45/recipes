"use client"

import { FormHTMLAttributes } from "react"
import { Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"

interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  className?: string
}

export function AuthButton({ className, label }: AuthButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button aria-disabled={pending} className={className}>
      {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
      {label}
    </Button>
  )
}
