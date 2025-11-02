"use client"

import { loginFormItems } from "@/lib/constants"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Typography } from "@/components/ui/typography"
import { login } from "@/app/(auth)/actions"
import { AuthButton } from "@/app/(auth)/auth-button"

export function LoginForm() {
  return (
    <form
      className="w-full border bg-background p-8 shadow-sm md:px-24"
      autoComplete="off"
    >
      <FieldSet className="flex flex-col gap-6" aria-labelledby="login-heading">
        <FieldLegend
          id="login-heading"
          className="sr-only"
          variant="legend"
        >
          Login
        </FieldLegend>
        <Typography variant="h2" className="text-balance text-center">
          Login
        </Typography>
        {loginFormItems.map(({ type, fieldName, placeholder, label }) => {
          const autoComplete =
            fieldName === "email"
              ? "email"
              : fieldName === "password"
                ? "current-password"
                : "off"

          return (
            <Field key={fieldName}>
              <FieldLabel htmlFor={fieldName} className="text-lg">
                {label}
              </FieldLabel>
              <FieldContent>
                <Input
                  className="text-lg"
                  id={fieldName}
                  name={fieldName}
                  placeholder={placeholder}
                  required
                  autoComplete={autoComplete}
                  type={type}
                />
              </FieldContent>
            </Field>
          )
        })}
        <AuthButton label="Login" action={login} className="w-full" />
      </FieldSet>
    </form>
  )
}
