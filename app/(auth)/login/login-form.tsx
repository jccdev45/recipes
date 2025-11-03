"use client"

import { useMemo, useRef, useState } from "react"
import { useForm } from "@tanstack/react-form"

import { loginFormItems } from "@/lib/constants"
import { isRedirectError } from "@/lib/utils"
import { LoginSchema } from "@/lib/zod/schema"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  FieldContent,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Field as FieldWrapper,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Typography } from "@/components/ui/typography"
import { login } from "@/app/(auth)/actions"

import type { LoginFormValues } from "@/lib/zod/schema"

type LoginFieldName = keyof LoginFormValues

const DEFAULT_VALUES: LoginFormValues = loginFormItems.reduce(
  (acc, item) => ({ ...acc, [item.fieldName]: "" }),
  {} as LoginFormValues
)

const autocompleteByField: Record<LoginFieldName, string> = {
  email: "email",
  password: "current-password",
}

export function LoginForm() {
  const [formError, setFormError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const defaultValues = useMemo(() => ({ ...DEFAULT_VALUES }), [])

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: LoginSchema,
    },
    onSubmit: async () => {
      setFormError(null)

      if (!formRef.current) {
        return
      }

      const formData = new FormData(formRef.current)

      for (const [key, val] of formData.entries()) {
        if (typeof val === "string") {
          formData.set(key, val.trim())
        }
      }

      try {
        const result = await login(formData)

        if (result?.errors) {
          Object.entries(result.errors).forEach(([key, messages]) => {
            if (!messages?.length) return

            form.setFieldMeta(key as LoginFieldName, (prev) => {
              const nextErrors = messages.map((message) => ({ message }))

              return {
                ...prev,
                isTouched: true,
                errorMap: {
                  ...prev.errorMap,
                  onSubmit: nextErrors,
                },
                errorSourceMap: {
                  ...prev.errorSourceMap,
                  onSubmit: "form",
                },
              }
            })
          })
        }

        if (result?.message && !result.errors) {
          setFormError(result.message)
        }
      } catch (error) {
        if (isRedirectError(error)) {
          throw error
        }

        setFormError("We couldn’t log you in. Please try again.")
      }
    },
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await form.handleSubmit()
    } catch (error) {
      if (isRedirectError(error)) {
        return
      }

      throw error
    }
  }

  const TanstackField = form.Field

  return (
    <form
      className="bg-background w-full border p-8 shadow-sm md:px-24"
      autoComplete="on"
      noValidate
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <FieldSet className="flex flex-col gap-6" aria-labelledby="login-heading">
        <FieldLegend id="login-heading" className="sr-only" variant="legend">
          Login
        </FieldLegend>
        <Typography variant="h2" className="text-center text-balance">
          Login
        </Typography>

        {formError ? (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        ) : null}

        {loginFormItems.map(({ type, fieldName, placeholder, label }) => {
          const inputId = `login-${fieldName}`
          const errorId = `${inputId}-error`

          return (
            <TanstackField name={fieldName} key={fieldName}>
              {(field) => {
                const errors = field.state.meta.errors
                const hasError = errors?.length > 0

                return (
                  <FieldWrapper data-invalid={hasError || undefined}>
                    <FieldLabel htmlFor={inputId} className="text-lg">
                      {label}
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id={inputId}
                        name={field.name}
                        type={type}
                        value={field.state.value}
                        placeholder={placeholder}
                        autoComplete={
                          autocompleteByField[field.name as LoginFieldName]
                        }
                        aria-invalid={hasError}
                        aria-describedby={hasError ? errorId : undefined}
                        className="text-lg"
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        required
                      />
                      {hasError ? (
                        <FieldError id={errorId} errors={errors} />
                      ) : null}
                    </FieldContent>
                  </FieldWrapper>
                )
              }}
            </TanstackField>
          )
        })}

        <form.Subscribe
          selector={(state) => ({
            isSubmitting: state.isSubmitting,
            canSubmit: state.canSubmit,
          })}
        >
          {({ isSubmitting, canSubmit }) => (
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !canSubmit}
              aria-busy={isSubmitting}
            >
              <span className="inline-flex items-center justify-center gap-2">
                {isSubmitting ? <Spinner size="sm" aria-hidden="true" /> : null}
                <span>{isSubmitting ? "Logging in..." : "Login"}</span>
              </span>
            </Button>
          )}
        </form.Subscribe>
      </FieldSet>
    </form>
  )
}
