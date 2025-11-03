"use client"

import { useId, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"

import { registerFormItems } from "@/lib/constants"
import { cn, isRedirectError } from "@/lib/utils"
import { EditProfileSchema, RegisterSchema } from "@/lib/zod/schema"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { signup, updateProfile } from "@/app/(auth)/actions"

import type { RegisterFormValues } from "@/lib/zod/schema"
import type { User } from "@supabase/supabase-js"

type RegisterFieldName = (typeof registerFormItems)[number]["fieldName"]
type EditProfileFormValues = z.infer<typeof EditProfileSchema>
type FieldErrorRecord = Partial<Record<RegisterFieldName, string[]>>

const registerDefaults: RegisterFormValues = registerFormItems.reduce(
  (acc, item) => ({ ...acc, [item.fieldName]: "" }),
  {} as RegisterFormValues
)

const registerAutocomplete: Record<RegisterFieldName, string> = {
  first_name: "given-name",
  last_name: "family-name",
  email: "email",
  password: "new-password",
  confirm_password: "new-password",
}

const editAutocomplete = registerAutocomplete

const fullWidthFields: RegisterFieldName[] = [
  "email",
  "password",
  "confirm_password",
]

const getColumnClass = (fieldName: RegisterFieldName) =>
  fullWidthFields.includes(fieldName) ? "md:col-span-2" : "md:col-span-1"

const applyServerFieldErrors = <TField extends string>(
  setFieldMeta: (field: TField, updater: (prev: any) => any) => void,
  errors: Record<string, string[] | undefined>
) => {
  Object.entries(errors).forEach(([key, messages]) => {
    if (!messages?.length) {
      return
    }

    setFieldMeta(key as TField, (prev: any) => {
      const nextErrors = messages.map((message) => ({ message }))

      return {
        ...prev,
        isTouched: true,
        errorMap: {
          ...(prev?.errorMap ?? {}),
          onSubmit: nextErrors,
        },
        errorSourceMap: {
          ...(prev?.errorSourceMap ?? {}),
          onSubmit: "form",
        },
      }
    })
  })
}

interface UserProfileFormProps {
  title: string
  formType: "register" | "edit"
  userData?: User
}

export function UserProfileForm({
  title,
  formType,
  userData,
}: UserProfileFormProps) {
  if (formType === "register") {
    return <RegisterProfileForm title={title} />
  }

  return <EditProfileForm title={title} userData={userData} />
}

function RegisterProfileForm({ title }: { title: string }) {
  const headingId = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const defaultValues = useMemo(() => ({ ...registerDefaults }), [])

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: RegisterSchema,
    },
    onSubmit: async () => {
      if (!formRef.current) {
        return
      }

      setFormError(null)

      const formData = new FormData(formRef.current)

      for (const [key, val] of formData.entries()) {
        if (typeof val === "string") {
          formData.set(key, val.trim())
        }
      }

      try {
        const result = await signup(formData)

        if (result?.errors) {
          applyServerFieldErrors<RegisterFieldName>(
            form.setFieldMeta,
            result.errors as FieldErrorRecord
          )
        }

        if (result?.message && !result.errors) {
          setFormError(result.message)
        }
      } catch (error) {
        if (isRedirectError(error)) {
          throw error
        }

        setFormError(
          "We couldn’t complete your registration. Please try again."
        )
      }
    },
  })

  const TanstackField = form.Field

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

  return (
    <form
      ref={formRef}
      className="bg-background rounded border p-8 drop-shadow-sm"
      autoComplete="on"
      noValidate
      onSubmit={handleSubmit}
      aria-labelledby={headingId}
    >
      <Typography id={headingId} variant="h2">
        {title}
      </Typography>
      {formError ? (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}
      <FieldSet
        className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
        aria-describedby={`${headingId}-legend`}
      >
        <FieldLegend id={`${headingId}-legend`} className="sr-only">
          Create your profile
        </FieldLegend>
        {registerFormItems.map(
          ({ fieldName, label, placeholder, type, required }) => {
            const inputId = `register-${fieldName}`
            const errorId = `${inputId}-error`

            return (
              <div
                key={fieldName}
                className={cn(getColumnClass(fieldName), "flex flex-col")}
              >
                <TanstackField name={fieldName}>
                  {(field) => {
                    const errors = field.state.meta.errors
                    const hasError = errors?.length > 0

                    return (
                      <FieldWrapper
                        data-invalid={hasError || undefined}
                        className="flex-col"
                      >
                        <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
                        <FieldContent>
                          <Input
                            id={inputId}
                            name={field.name}
                            type={type}
                            value={field.state.value}
                            placeholder={placeholder}
                            autoComplete={
                              registerAutocomplete[
                                field.name as RegisterFieldName
                              ]
                            }
                            aria-invalid={hasError}
                            aria-describedby={hasError ? errorId : undefined}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                              field.handleChange(event.target.value)
                            }
                            required={required}
                          />
                          {hasError ? (
                            <FieldError id={errorId} errors={errors} />
                          ) : null}
                        </FieldContent>
                      </FieldWrapper>
                    )
                  }}
                </TanstackField>
              </div>
            )
          }
        )}
        <form.Subscribe
          selector={(state) => ({
            isSubmitting: state.isSubmitting,
            canSubmit: state.canSubmit,
          })}
        >
          {({ isSubmitting, canSubmit }) => (
            <div className="md:col-span-2">
              <Button
                type="submit"
                className="w-full sm:w-1/2"
                disabled={isSubmitting || !canSubmit}
                aria-busy={isSubmitting}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <Spinner size="sm" aria-hidden="true" />
                  ) : null}
                  <span>{isSubmitting ? "Signing up..." : title}</span>
                </span>
              </Button>
            </div>
          )}
        </form.Subscribe>
      </FieldSet>
    </form>
  )
}

function EditProfileForm({
  title,
  userData,
}: {
  title: string
  userData?: User
}) {
  const headingId = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const defaultValues = useMemo<EditProfileFormValues>(
    () => ({
      email: userData?.email ?? "",
      first_name:
        typeof userData?.user_metadata?.first_name === "string" &&
        userData.user_metadata.first_name.length > 0
          ? userData.user_metadata.first_name
          : undefined,
      last_name:
        typeof userData?.user_metadata?.last_name === "string" &&
        userData.user_metadata.last_name.length > 0
          ? userData.user_metadata.last_name
          : undefined,
      password: undefined,
      confirm_password: undefined,
    }),
    [userData]
  )

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: EditProfileSchema,
    },
    onSubmit: async () => {
      if (!formRef.current) {
        return
      }

      setFormError(null)

      const formData = new FormData(formRef.current)

      for (const [key, val] of formData.entries()) {
        if (typeof val === "string") {
          formData.set(key, val.trim())
        }
      }

      try {
        const result = await updateProfile(formData)

        if (result?.errors) {
          applyServerFieldErrors<RegisterFieldName>(
            form.setFieldMeta,
            result.errors as FieldErrorRecord
          )
        }

        if (result?.message && !result.errors) {
          setFormError(result.message)
        }
      } catch (error) {
        if (isRedirectError(error)) {
          throw error
        }

        setFormError("We couldn’t update your profile. Please try again.")
      }
    },
  })

  const TanstackField = form.Field

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

  return (
    <form
      ref={formRef}
      className="bg-background rounded border p-8 drop-shadow-sm"
      autoComplete="on"
      noValidate
      onSubmit={handleSubmit}
      aria-labelledby={headingId}
    >
      <Typography id={headingId} variant="h2">
        {title}
      </Typography>
      {formError ? (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}
      <FieldSet
        className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
        aria-describedby={`${headingId}-legend`}
      >
        <FieldLegend id={`${headingId}-legend`} className="sr-only">
          Update your profile information
        </FieldLegend>
        {registerFormItems.map(({ fieldName, label, placeholder, type }) => {
          const inputId = `edit-${fieldName}`
          const errorId = `${inputId}-error`

          return (
            <div
              key={fieldName}
              className={cn(getColumnClass(fieldName), "flex flex-col")}
            >
              <TanstackField name={fieldName}>
                {(field) => {
                  const errors = field.state.meta.errors
                  const hasError = errors?.length > 0

                  return (
                    <FieldWrapper
                      data-invalid={hasError || undefined}
                      className="flex-col"
                    >
                      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
                      <FieldContent>
                        <Input
                          id={inputId}
                          name={field.name}
                          type={type}
                          value={field.state.value ?? ""}
                          placeholder={placeholder}
                          autoComplete={
                            editAutocomplete[field.name as RegisterFieldName]
                          }
                          aria-invalid={hasError}
                          aria-describedby={hasError ? errorId : undefined}
                          onBlur={field.handleBlur}
                          onChange={(event) => {
                            const nextValue = event.target.value
                            field.handleChange(
                              nextValue === "" ? undefined : nextValue
                            )
                          }}
                          required={false}
                        />
                        {hasError ? (
                          <FieldError id={errorId} errors={errors} />
                        ) : null}
                      </FieldContent>
                    </FieldWrapper>
                  )
                }}
              </TanstackField>
            </div>
          )
        })}
        <form.Subscribe
          selector={(state) => ({
            isSubmitting: state.isSubmitting,
            canSubmit: state.canSubmit,
          })}
        >
          {({ isSubmitting, canSubmit }) => (
            <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row md:col-span-2">
              <CancelButton userData={userData} />
              <Button
                type="submit"
                className="w-full sm:w-1/2"
                disabled={isSubmitting || !canSubmit}
                aria-busy={isSubmitting}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <Spinner size="sm" aria-hidden="true" />
                  ) : null}
                  <span>{isSubmitting ? "Saving changes..." : "Confirm"}</span>
                </span>
              </Button>
            </div>
          )}
        </form.Subscribe>
      </FieldSet>
    </form>
  )
}

function CancelButton({ userData }: { userData?: User }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full sm:w-1/4" type="button">
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Any changes you may have made will be discarded. Do you still want
            to exit?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, go back</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button asChild variant="destructive">
              <Link href={`/profile/${userData?.id ?? ""}`}>
                Yes, discard changes
              </Link>
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
