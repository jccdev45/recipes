"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { createClient } from "@/supabase/client"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"

import { registerFormItems } from "@/lib/constants"
import { cn, isRedirectError, resolveStorageImageUrl } from "@/lib/utils"
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
import { UserAvatar } from "@/components/user-avatar"
import { signup, updateProfile } from "@/app/(auth)/actions"

import type { RegisterFormValues } from "@/lib/zod/schema"
import type { User } from "@supabase/supabase-js"
import type { ChangeEvent } from "react"

type RegisterFieldName = (typeof registerFormItems)[number]["fieldName"]
type EditProfileFormValues = z.infer<typeof EditProfileSchema>
type FieldErrorRecord = Partial<Record<RegisterFieldName, string[]>>

interface ProfileMetadata {
  avatar_url?: string | null
  first_name?: string | null
  last_name?: string | null
}

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
  className?: string
  profileData?: ProfileMetadata
}

export function UserProfileForm({
  title,
  formType,
  userData,
  className,
  profileData,
}: UserProfileFormProps) {
  if (formType === "register") {
    return <RegisterProfileForm title={title} className={className} />
  }

  return (
    <EditProfileForm
      title={title}
      userData={userData}
      className={className}
      profileData={profileData}
    />
  )
}

function RegisterProfileForm({
  title,
  className,
}: {
  title: string
  className?: string
}) {
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
      className={cn("flex flex-col gap-6", className)}
      autoComplete="on"
      noValidate
      onSubmit={handleSubmit}
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="sr-only">
        {title}
      </h2>
      <FieldSet
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        aria-describedby={`${headingId}-legend`}
      >
        <FieldLegend id={`${headingId}-legend`} className="sr-only">
          {title}
        </FieldLegend>

        {formError ? (
          <Alert variant="destructive" className="md:col-span-2">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        ) : null}

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
                className="w-full"
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
  className,
  profileData,
}: {
  title: string
  userData?: User
  className?: string
  profileData?: ProfileMetadata
}) {
  const headingId = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const supabase = createClient()

  const [formError, setFormError] = useState<string | null>(null)
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(
    null
  )
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarFileName, setAvatarFileName] = useState<string>("")
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)
  const [uploadedAvatarPath, setUploadedAvatarPath] = useState<string | null>(
    null
  )

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl)
      }
    }
  }, [localPreviewUrl])

  const safeMetadataValue = (value: unknown) =>
    typeof value === "string" && value.trim().length > 0
      ? value.trim()
      : undefined

  const initialFirstName =
    safeMetadataValue(profileData?.first_name) ??
    safeMetadataValue(userData?.user_metadata?.first_name)

  const initialLastName =
    safeMetadataValue(profileData?.last_name) ??
    safeMetadataValue(userData?.user_metadata?.last_name)

  const initialAvatarPath =
    safeMetadataValue(profileData?.avatar_url) ??
    safeMetadataValue(userData?.user_metadata?.avatar_url)

  const defaultValues = useMemo<EditProfileFormValues>(
    () => ({
      email: userData?.email ?? "",
      first_name: initialFirstName,
      last_name: initialLastName,
      password: undefined,
      confirm_password: undefined,
      avatar_url: initialAvatarPath,
    }),
    [userData?.email, initialFirstName, initialLastName, initialAvatarPath]
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

  const resolvedCurrentAvatar = useMemo(
    () => resolveStorageImageUrl(initialAvatarPath),
    [initialAvatarPath]
  )

  const resolvedUploadedAvatar = useMemo(
    () => resolveStorageImageUrl(uploadedAvatarPath),
    [uploadedAvatarPath]
  )

  const futureFirstName =
    safeMetadataValue(form.state.values.first_name) ?? initialFirstName
  const futureLastName =
    safeMetadataValue(form.state.values.last_name) ?? initialLastName
  const futureEmail =
    safeMetadataValue(form.state.values.email) ??
    safeMetadataValue(userData?.email)

  const previewAvatarSrc =
    localPreviewUrl ?? resolvedUploadedAvatar ?? resolvedCurrentAvatar ?? null

  const hasCurrentAvatar = Boolean(resolvedCurrentAvatar)
  const hasPendingAvatar = Boolean(localPreviewUrl || resolvedUploadedAvatar)

  const handleAvatarFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null

    if (!file) {
      setAvatarFileName("")
      setAvatarUploadError(null)
      setLocalPreviewUrl(null)
      setUploadedAvatarPath(null)
      form.setFieldValue("avatar_url", initialAvatarPath ?? undefined)
      event.target.value = ""
      return
    }

    if (!file.type.startsWith("image/")) {
      setAvatarUploadError(
        "Please choose an image file (PNG, JPG, GIF, or WEBP)."
      )
      event.target.value = ""
      return
    }

    setAvatarUploadError(null)
    setAvatarFileName(file.name)

    const nextPreviewUrl = URL.createObjectURL(file)
    setLocalPreviewUrl(nextPreviewUrl)

    if (!userData?.id) {
      setAvatarUploadError("We could not confirm your account. Try again.")
      return
    }

    setIsUploadingAvatar(true)

    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    const uniqueSuffix =
      typeof crypto !== "undefined" ? crypto.randomUUID() : `${Date.now()}`
    const fileName = fileExtension
      ? `${userData.id}-${uniqueSuffix}.${fileExtension}`
      : `${userData.id}-${uniqueSuffix}`
    const filePath = `avatars/${userData.id}/${fileName}`

    try {
      const { data, error } = await supabase.storage
        .from("photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type || undefined,
        })

      if (error) {
        setAvatarUploadError(
          error.message || "We couldn’t upload your image. Please try again."
        )
        setUploadedAvatarPath(null)
        setLocalPreviewUrl(null)
        setAvatarFileName("")
        form.setFieldValue("avatar_url", initialAvatarPath ?? undefined)
      } else if (data) {
        const normalizedPath = data.path.startsWith("/")
          ? data.path
          : `/${data.path}`
        setUploadedAvatarPath(normalizedPath)
        form.setFieldValue("avatar_url", normalizedPath)
      }
    } catch (uploadError) {
      console.error("Avatar upload failed", uploadError)
      setAvatarUploadError("We couldn’t upload your image. Please try again.")
      setUploadedAvatarPath(null)
      setLocalPreviewUrl(null)
      setAvatarFileName("")
      form.setFieldValue("avatar_url", initialAvatarPath ?? undefined)
    } finally {
      setIsUploadingAvatar(false)
      event.target.value = ""
    }
  }

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
      className={cn(
        "bg-background rounded-3xl border p-6 shadow-sm sm:p-8",
        className
      )}
      autoComplete="on"
      noValidate
      onSubmit={handleSubmit}
      aria-labelledby={headingId}
    >
      <Typography id={headingId} variant="h2">
        {title}
      </Typography>

      <input
        type="hidden"
        name="avatar_url"
        value={form.state.values.avatar_url ?? ""}
      />

      <section className="mt-4 space-y-6 rounded-2xl border border-dashed p-5 sm:p-6">
        <div className="space-y-2">
          <Typography variant="h3" className="text-lg font-semibold">
            Profile photo
          </Typography>
          <Typography variant="muted" className="text-sm leading-relaxed">
            Upload a clear photo so loved ones can recognize your recipes. If
            you skip this step, we’ll display a colorful initial from your first
            name, or from your email address when no first name is provided.
          </Typography>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <Typography
              variant="small"
              className="text-muted-foreground text-xs font-semibold tracking-wide uppercase"
            >
              Current
            </Typography>
            <UserAvatar
              size="xl"
              firstName={initialFirstName}
              lastName={initialLastName}
              email={safeMetadataValue(userData?.email)}
              src={resolvedCurrentAvatar}
              className="bg-background border shadow-sm"
            />
            <Typography variant="muted" className="text-sm leading-relaxed">
              {hasCurrentAvatar
                ? "This photo is currently visible on your profile."
                : "You have not uploaded a profile photo yet."}
            </Typography>
          </div>
          <div className="space-y-3">
            <Typography
              variant="small"
              className="text-muted-foreground text-xs font-semibold tracking-wide uppercase"
            >
              Preview
            </Typography>
            <UserAvatar
              size="xl"
              firstName={futureFirstName}
              lastName={futureLastName}
              email={futureEmail}
              src={previewAvatarSrc}
              className="bg-background border shadow-sm"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
                aria-label="Upload profile photo"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                aria-busy={isUploadingAvatar}
              >
                <span className="inline-flex items-center gap-2">
                  {isUploadingAvatar ? (
                    <Spinner size="sm" aria-hidden="true" />
                  ) : null}
                  <span>
                    {isUploadingAvatar ? "Uploading..." : "Upload image"}
                  </span>
                </span>
              </Button>
              <span className="text-muted-foreground text-sm">
                {avatarFileName || "No file selected"}
              </span>
            </div>
            <Typography variant="muted" className="text-sm leading-relaxed">
              {hasPendingAvatar
                ? "This preview shows how your profile photo will look after saving."
                : "If you skip the upload, we’ll show an initial from your first name, or from your email when no name is provided."}
            </Typography>
            {avatarUploadError ? (
              <Alert variant="destructive">
                <AlertDescription>{avatarUploadError}</AlertDescription>
              </Alert>
            ) : null}
          </div>
        </div>
      </section>

      {formError ? (
        <Alert variant="destructive" className="mt-6">
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
