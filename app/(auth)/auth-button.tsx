import { forwardRef } from "react"

import { Button } from "@/components/ui/button"
import { login, signup, updateProfile } from "@/app/(auth)/actions"

type AuthAction = typeof login | typeof signup | typeof updateProfile

interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  action: AuthAction
  className?: string
}

export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ className, label, action, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={className}
        formAction={action}
        type="submit"
        {...props}
      >
        {label}
      </Button>
    )
  }
)

AuthButton.displayName = "AuthButton"
