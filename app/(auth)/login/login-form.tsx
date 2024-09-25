"use client"

import { Fragment } from "react"

import { loginFormItems } from "@/lib/constants"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import { login } from "@/app/(auth)/actions"
import { AuthButton } from "@/app/(auth)/auth-button"

export function LoginForm() {
  return (
    <form
      className="w-full border bg-background p-8 shadow md:px-24"
      autoComplete="off"
    >
      <fieldset className="flex flex-col items-start gap-4">
        <Typography variant="h2" className="mx-auto w-2/3 text-center">
          Login
        </Typography>
        {loginFormItems.map(({ type, fieldName, placeholder, label }) => (
          <Fragment key={fieldName}>
            <Label className="text-lg" htmlFor={fieldName}>
              {label}
            </Label>
            <Input
              className="text-lg"
              id={fieldName}
              name={fieldName}
              placeholder={placeholder}
              required
              type={type}
            />
          </Fragment>
        ))}
        <AuthButton label="Login" action={login} />
      </fieldset>
    </form>
  )
}
