"use client"

import { Fragment } from "react"
import { useFormState } from "react-dom"
import { toast } from "sonner"

import { loginFormItems } from "@/lib/constants"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TypographyH2 } from "@/components/ui/typography"
import { login } from "@/app/(auth)/actions"
import { AuthButton } from "@/app/(auth)/auth-button"

const initialState = {
  message: "",
  errors: {},
}

export function LoginForm() {
  // const [state, formAction] = useFormState(login, initialState)

  // Display errors as toast notifications
  // if (state?.errors) {
  //   Object.entries(state.errors).forEach(([key, errors]) => {
  //     if (Array.isArray(errors)) {
  //       errors.forEach((error) => toast.error(error))
  //     }
  //   })
  // }

  return (
    <form
      className="w-full border bg-background p-8 shadow md:px-24"
      autoComplete="off"
    >
      <fieldset className="flex flex-col items-start gap-4">
        <TypographyH2 className="mx-auto w-2/3 text-center">Login</TypographyH2>
        {loginFormItems.map(({ type, fieldName, placeholder, label }) => (
          <Fragment key={fieldName}>
            <Label className="text-lg" htmlFor={fieldName}>
              {label}
            </Label>
            <Input
              id={fieldName}
              name={fieldName}
              type={type}
              placeholder={placeholder}
              required
              className="text-lg"
            />
          </Fragment>
        ))}
        {/* <div aria-live="polite">
          {state?.errors ? (
            Object.entries(state.errors).map(([field, errors]) =>
              Array.isArray(errors)
                ? errors.map((error) => (
                    <p key={`${field}-${error}`} className="text-red-500">
                      {error}
                    </p>
                  ))
                : null
            )
          ) : (
            <p>{state?.message}</p>
          )}
        </div> */}
        <AuthButton label="Login" action={login} />
      </fieldset>
    </form>
  )
}
