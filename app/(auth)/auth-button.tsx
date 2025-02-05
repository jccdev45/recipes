import { forwardRef } from "react"

import { Button } from "@/components/ui/button"

type AuthAction = (
  formData: FormData
) => Promise<
  | { message: string; errors?: undefined }
  | { message: string; errors: { email?: string[]; password?: string[] } }
>

interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  action: AuthAction
  className?: string
}

export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ className, label, action, ...props }, ref) => {
    const handleFormAction = async (formData: FormData) => {
      const result = await action(formData)
      // Handle the result as needed, e.g., display a message or handle errors
      console.log(result.message)
      if (result.errors) {
        console.error(result.errors)
      }
    }

    return (
      <Button
        ref={ref}
        className={className}
        formAction={handleFormAction}
        type="submit"
        {...props}
      >
        {label}
      </Button>
    )
  }
)

AuthButton.displayName = "AuthButton"
