"use client"

import { Fragment } from "react"
import Link from "next/link"
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
  const [state, formAction] = useFormState(login, initialState)

  // const renderErrors =
  //   state && state.errors
  //     ? Object.keys(state.errors).map((key) => {
  //         // TODO: Fix this 😩
  //         // @ts-ignore
  //         if (state.errors[key] && state.errors[key]?.length) {
  //           // @ts-ignore
  //           return state.errors[key].map((error) =>
  //             // <p key={`${key}-${error}`}>{error}</p>
  //             toast.error(error)
  //           )
  //         }
  //       })
  //     : null

  return (
    <form
      className="w-full border bg-background p-8 shadow md:px-24"
      action={formAction}
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
        <div aria-live="polite">
          {!state?.errors ? (
            <p>{state?.message}</p>
          ) : (
            Object.entries(state?.errors)
          )}
        </div>
        <AuthButton
          label="Login"
          // formAction={formAction}
          // onClick={() => {
          //   if (state?.message || state?.errors) {
          //     toast.error("There was a problem with the request", {
          //       description: state.message,
          //     })
          //   }
          // }}
        />
      </fieldset>

      <Link
        href="/signup"
        className="text-foreground/90 underline transition-colors duration-100 ease-in-out hover:text-foreground"
      >
        Need an account?
      </Link>
    </form>
  )
}
