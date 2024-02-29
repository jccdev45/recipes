"use client"

import Link from "next/link"
import { useFormState } from "react-dom"
import { toast } from "sonner"

import { registerFormItems } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TypographyH2 } from "@/components/ui/typography"
import { signup } from "@/app/(auth)/actions"
import { AuthButton } from "@/app/(auth)/auth-button"

const initialState = {
  message: "",
  errors: {},
}

export function SignupForm() {
  const [state, formAction] = useFormState(signup, initialState)

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
    <form className="border bg-background p-8 shadow" action={formAction}>
      <fieldset className="grid auto-cols-auto gap-4">
        <TypographyH2 className="col-span-2 mx-auto w-full text-center">
          Sign Up
        </TypographyH2>
        {registerFormItems.map(
          ({ type, fieldName, placeholder, label, required }) => (
            <div
              key={fieldName}
              className={cn(
                "col-span-2 space-y-1 *:text-lg md:col-span-1",
                fieldName === "email" && "md:col-span-2"
              )}
            >
              <Label htmlFor={fieldName}>{label}</Label>
              <Input
                id={fieldName}
                name={fieldName}
                type={type}
                placeholder={placeholder}
                required={required}
                className=""
              />
            </div>
          )
        )}
        <div aria-live="polite">
          {!state?.errors ? (
            <p>{state?.message}</p>
          ) : (
            Object.entries(state?.errors)
          )}
        </div>
        <AuthButton
          label="Sign up"
          className="col-span-2 mx-auto w-1/2"
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
        href="/login"
        className="text-foreground/90 underline transition-colors duration-100 ease-in-out hover:text-foreground"
      >
        Have an account already?
      </Link>
    </form>
  )
}
