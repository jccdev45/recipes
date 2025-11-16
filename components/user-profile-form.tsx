"use client"

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { createClient } from "@/supabase/client"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"

import { registerFormItems } from "@/lib/constants"
import { cn, isRedirectError, resolveStorageImageUrl } from "@/lib/utils"
import { EditProfileSchema, RegisterSchema } from "@/lib/zod/schema"
import { useCurrentUserImage } from "@/hooks/use-current-user-image"
import { useSupabaseUpload } from "@/hooks/use-supabase-upload"
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
import { ErrorDisplay } from "@/components/error/error-display"
import { ImageUploadField } from "@/components/image-upload-field"
import { UserAvatar } from "@/components/user-avatar"
import { signup, updateProfile } from "@/app/(auth)/actions"

import type { UploadResult } from "@/hooks/use-supabase-upload"
import type { RegisterFormValues } from "@/lib/zod/schema"
import type { User } from "@supabase/supabase-js"

type RegisterFieldName = (typeof registerFormItems)[number]["fieldName"]
type EditProfileFormValues = z.infer<typeof EditProfileSchema>
type FieldErrorRecord = Partial<Record<RegisterFieldName, string[]>>

interface ProfileMetadata {
  avatar_url?: string | null
  first_name?: string | null
  last_name?: string | null
}

const registerDefaultValues: RegisterFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
  avatar_url: undefined,
}

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

const AVATAR_BUCKET = "photos"

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

  const defaultValues = useMemo(
    () => ({ ...registerDefaultValues }) as RegisterFormValues,
    []
  )

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
      <input
        type="hidden"
        name="avatar_url"
        value={form.state.values.avatar_url ?? ""}
      />
      <FieldSet
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        aria-describedby={`${headingId}-legend`}
      >
        <FieldLegend id={`${headingId}-legend`} className="sr-only">
          {title}
        </FieldLegend>

        <ErrorDisplay
          error={formError}
          title="We couldn't complete your signup"
          className="md:col-span-2"
          role="alert"
        />

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
      <Alert variant="default" className="border-dashed">
        <AlertDescription>
          You can add a profile photo after creating your account. Once you sign
          in, visit your profile to upload an image anytime.
        </AlertDescription>
      </Alert>
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

  const [formError, setFormError] = useState<string | null>(null)
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(
    null
  )
  const [uploadedAvatarPath, setUploadedAvatarPath] = useState<string | null>(
    null
  )

  const userMetadata = userData?.user_metadata as
    | Record<string, unknown>
    | undefined

  const getMetadataString = (value?: unknown) =>
    typeof value === "string" && value.trim().length > 0
      ? value.trim()
      : undefined

  const safeMetadataValue = (value: unknown) =>
    typeof value === "string" && value.trim().length > 0
      ? value.trim()
      : undefined

  const initialFirstName =
    safeMetadataValue(profileData?.first_name) ??
    safeMetadataValue(userMetadata?.["first_name"] as string | undefined)

  const initialLastName =
    safeMetadataValue(profileData?.last_name) ??
    safeMetadataValue(userMetadata?.["last_name"] as string | undefined)

  const metadataAvatarPath = getMetadataString(
    userMetadata?.["avatar_url"] ??
      userMetadata?.["avatarUrl"] ??
      userMetadata?.["avatar"]
  )

  const initialAvatarPath =
    safeMetadataValue(profileData?.avatar_url) ??
    safeMetadataValue(metadataAvatarPath)

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

  const supabaseClient = useMemo(() => createClient(), [])

  const {
    files: avatarFiles,
    addFiles: addAvatarFiles,
    reset: resetAvatarUpload,
    onUpload: uploadAvatarFiles,
    loading: isUploadingAvatar,
    errors: hookAvatarErrors,
  } = useSupabaseUpload({
    bucketName: AVATAR_BUCKET,
    maxFiles: 1,
    allowedMimeTypes: ["image/*"],
    maxFileSize: 5 * 1024 * 1024,
    cacheControl: 3600,
    upsert: true,
    createFilePath: ({ file, defaultPath }) => {
      if (!userData?.id) {
        return defaultPath
      }

      const extension = file.name.split(".").pop()?.toLowerCase()
      const normalizedExtension = extension?.replace(/[^a-z0-9]/gi, "")
      const uniqueSuffix =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`
      const fileName = normalizedExtension
        ? `${userData.id}-${uniqueSuffix}.${normalizedExtension}`
        : `${userData.id}-${uniqueSuffix}`

      return `avatars/${userData.id}/${fileName}`
    },
    onUploadComplete: ({ path }) => {
      const normalizedPath = path.startsWith("/") ? path : `/${path}`
      setUploadedAvatarPath(normalizedPath)
      form.setFieldValue("avatar_url", normalizedPath)
      setAvatarUploadError(null)
    },
    onUploadError: ({ message }) => {
      setAvatarUploadError(message)
    },
  })

  const currentAvatarImage = useCurrentUserImage(initialAvatarPath)

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

  const queuedAvatarFile = avatarFiles[0]
  const queuedAvatarPreview = queuedAvatarFile?.preview ?? null

  const hasCurrentAvatar = Boolean(currentAvatarImage)
  const hasPendingAvatar = Boolean(
    queuedAvatarPreview || resolvedUploadedAvatar
  )

  const previewAvatarSrc = hasPendingAvatar
    ? (queuedAvatarPreview ?? resolvedUploadedAvatar ?? null)
    : null

  const avatarFileName =
    queuedAvatarFile?.name ?? uploadedAvatarPath?.split("/").pop() ?? null

  const combinedAvatarError =
    avatarUploadError ?? hookAvatarErrors[0]?.message ?? null

  const deleteSupabaseFile = useCallback(
    async (path?: string | null) => {
      if (!path) {
        return
      }

      const sanitizedPath = path.replace(/^\/+/, "")

      if (!sanitizedPath) {
        return
      }

      try {
        const { error } = await supabaseClient.storage
          .from(AVATAR_BUCKET)
          .remove([sanitizedPath])

        if (error) {
          console.error("Failed to delete unused avatar upload", error)
        }
      } catch (error) {
        console.error("Unexpected error deleting unused avatar upload", error)
      }
    },
    [supabaseClient]
  )

  const resetAvatarSelection = useCallback(async () => {
    if (uploadedAvatarPath) {
      await deleteSupabaseFile(uploadedAvatarPath)
    }

    resetAvatarUpload()
    setUploadedAvatarPath(null)
    form.setFieldValue("avatar_url", initialAvatarPath ?? undefined)
  }, [
    deleteSupabaseFile,
    form,
    initialAvatarPath,
    resetAvatarUpload,
    uploadedAvatarPath,
  ])

  const handleAvatarSelection = async (file: File | null) => {
    if (!file) {
      setAvatarUploadError(null)
      await resetAvatarSelection()
      return
    }

    if (!file.type?.startsWith("image/")) {
      setAvatarUploadError(
        "Please choose an image file (PNG, JPG, GIF, or WEBP)."
      )
      await resetAvatarSelection()
      return
    }

    if (!userData?.id) {
      setAvatarUploadError("We could not confirm your account. Try again.")
      await resetAvatarSelection()
      return
    }

    setAvatarUploadError(null)
    addAvatarFiles([file], { replace: true })

    const results = await uploadAvatarFiles()

    if (!results || results.length === 0) {
      setAvatarUploadError("We couldn’t upload your image. Please try again.")
      await resetAvatarSelection()
      return
    }

    const errorResult = results.find((result) => result.status === "error") as
      | Extract<UploadResult, { status: "error" }>
      | undefined

    if (errorResult) {
      setAvatarUploadError(errorResult.message)
      await resetAvatarSelection()
      return
    }

    const successResult = results.find(
      (result) => result.status === "success"
    ) as Extract<UploadResult, { status: "success" }> | undefined

    if (successResult) {
      const normalizedPath = successResult.path
      await deleteSupabaseFile(uploadedAvatarPath)
      setUploadedAvatarPath(normalizedPath)
      form.setFieldValue("avatar_url", normalizedPath)
      resetAvatarUpload()
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

      <ErrorDisplay
        error={formError}
        title="We couldn't update your profile"
        className="mt-6"
        role="alert"
      />

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
      </FieldSet>

      <ImageUploadField
        className="mt-6"
        title="Profile photo"
        description={
          <>
            <p>
              Upload a clear photo so loved ones can recognize your recipes.
            </p>
            <p className="mt-1">
              If you skip this step, we’ll display a colorful initial from your
              first name, or from your email address when no first name is
              provided.
            </p>
          </>
        }
        currentPreview={
          <UserAvatar
            size="xl"
            firstName={initialFirstName}
            lastName={initialLastName}
            email={safeMetadataValue(userData?.email)}
            src={currentAvatarImage}
            className="bg-background border shadow-sm"
          />
        }
        currentDescription={
          hasCurrentAvatar ? (
            <span>This photo is currently visible on your profile.</span>
          ) : (
            <span>You have not uploaded a profile photo yet.</span>
          )
        }
        preview={
          hasPendingAvatar ? (
            <UserAvatar
              size="xl"
              firstName={futureFirstName}
              lastName={futureLastName}
              email={futureEmail}
              src={previewAvatarSrc}
              className="bg-background border shadow-sm"
            />
          ) : null
        }
        previewDescription={
          hasPendingAvatar ? (
            <span>
              This preview shows how your profile photo will look after saving.
            </span>
          ) : (
            <span>
              If you skip the upload, we’ll show an initial from your first
              name, or from your email when no name is provided.
            </span>
          )
        }
        helperText="Accepted formats: PNG, JPG, GIF, or WEBP. Max size 5MB."
        onSelectFile={handleAvatarSelection}
        isUploading={isUploadingAvatar}
        uploadLabel="Upload image"
        uploadingLabel="Uploading..."
        fileName={hasPendingAvatar ? (avatarFileName ?? undefined) : undefined}
        error={combinedAvatarError}
        buttonAriaLabel="Upload profile photo"
        inputProps={{ "aria-label": "Choose profile photo" }}
        maxFileSize={5 * 1024 * 1024}
      />

      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          canSubmit: state.canSubmit,
        })}
      >
        {({ isSubmitting, canSubmit }) => (
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CancelButton
              userData={userData}
              onCancelIntent={resetAvatarSelection}
            />
            <Button
              type="submit"
              className="w-full sm:w-1/2"
              disabled={isSubmitting || !canSubmit}
              aria-busy={isSubmitting}
            >
              <span className="inline-flex items-center justify-center gap-2">
                {isSubmitting ? <Spinner size="sm" aria-hidden="true" /> : null}
                <span>{isSubmitting ? "Saving changes..." : "Confirm"}</span>
              </span>
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  )
}

function CancelButton({
  userData,
  onCancelIntent,
}: {
  userData?: User
  onCancelIntent?: () => Promise<void> | void
}) {
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        void onCancelIntent?.()
      }
    },
    [onCancelIntent]
  )

  return (
    <AlertDialog onOpenChange={handleOpenChange}>
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
