"use client"

import { useCallback, useId, useMemo, useRef, useState } from "react"
import { Upload } from "lucide-react"
import { useDropzone } from "react-dropzone"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Typography } from "@/components/ui/typography"

import type {
  ComponentProps,
  InputHTMLAttributes,
  MutableRefObject,
  ReactNode,
  Ref,
} from "react"
import type {
  Accept,
  DropzoneInputProps,
  FileError,
  FileRejection,
} from "react-dropzone"

interface ImageUploadFieldProps {
  title?: string
  description?: ReactNode
  currentLabel?: string
  currentPreview?: ReactNode
  currentDescription?: ReactNode
  previewLabel?: string
  preview?: ReactNode
  previewDescription?: ReactNode
  helperText?: ReactNode
  onSelectFile: (file: File | null) => void
  isUploading?: boolean
  uploadLabel?: string
  uploadingLabel?: string
  fileName?: string
  accept?: string
  disabled?: boolean
  error?: string | null
  className?: string
  hideCurrent?: boolean
  noFileText?: string
  buttonVariant?: ComponentProps<typeof Button>["variant"]
  buttonSize?: ComponentProps<typeof Button>["size"]
  buttonAriaLabel?: string
  maxFiles?: number
  maxFileSize?: number
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
  > & {
    "aria-label"?: string
  }
}

export function ImageUploadField({
  title,
  description,
  currentLabel = "Current",
  currentPreview,
  currentDescription,
  previewLabel = "Preview",
  preview,
  previewDescription,
  helperText,
  onSelectFile,
  isUploading = false,
  uploadLabel = "Upload image",
  uploadingLabel = "Uploading...",
  fileName,
  accept = "image/*",
  disabled = false,
  error,
  className,
  hideCurrent = false,
  noFileText = "No file selected",
  buttonVariant = "secondary",
  buttonSize,
  buttonAriaLabel,
  maxFiles,
  maxFileSize,
  inputProps,
}: ImageUploadFieldProps) {
  const dropzoneInputRef = useRef<HTMLInputElement | null>(null)
  const generatedId = useId()
  const inputId = inputProps?.id ?? `${generatedId}-file-input`
  const buttonId = `${inputId}-trigger`
  const [dropzoneError, setDropzoneError] = useState<string | null>(null)

  const resolvedMaxFiles = maxFiles ?? 1

  const acceptValue = useMemo<Accept | undefined>(() => {
    if (!accept) {
      return undefined
    }

    const entries = accept
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0)

    if (entries.length === 0) {
      return undefined
    }

    return entries.reduce<Accept>((accumulator, entry) => {
      accumulator[entry] = []
      return accumulator
    }, {})
  }, [accept])

  const resetInputValue = useCallback(() => {
    if (dropzoneInputRef.current) {
      dropzoneInputRef.current.value = ""
    }
  }, [])

  const handleDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const [{ errors: rejectionErrors }] = fileRejections
        const firstError = rejectionErrors[0]
        const message = formatRejectionError(firstError, {
          maxFiles: resolvedMaxFiles,
          maxFileSize,
          accept,
        })
        setDropzoneError(message)
        onSelectFile(null)
        resetInputValue()
        return
      }

      const nextFile = acceptedFiles[0] ?? null
      setDropzoneError(null)
      onSelectFile(nextFile)
      resetInputValue()
    },
    [accept, maxFileSize, onSelectFile, resetInputValue, resolvedMaxFiles]
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    open,
  } = useDropzone({
    accept: acceptValue,
    disabled: disabled || isUploading,
    multiple: resolvedMaxFiles > 1,
    maxFiles: resolvedMaxFiles,
    maxSize: maxFileSize,
    onDrop: handleDrop,
  })

  const rawInputProps = getInputProps({
    ...(inputProps ?? {}),
    id: inputId,
  }) as DropzoneInputProps & { ref?: Ref<HTMLInputElement> }

  const mergedInputRef = mergeRefs<HTMLInputElement>(
    rawInputProps.ref,
    dropzoneInputRef
  )

  const inputPropsFromDropzone = {
    ...rawInputProps,
    ref: mergedInputRef,
  } as DropzoneInputProps & { ref: Ref<HTMLInputElement> }

  const showCurrentColumn = !hideCurrent
  const hasUploadError = Boolean(error || dropzoneError)
  const hasSelection = Boolean(fileName)

  const dropzoneClassName = cn(
    "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors",
    disabled || isUploading
      ? "cursor-not-allowed opacity-80"
      : "cursor-pointer",
    isDragActive && "border-primary bg-primary/10",
    isDragAccept && "border-primary",
    (isDragReject || hasUploadError) && "border-destructive bg-destructive/10",
    hasSelection &&
      !hasUploadError &&
      !isDragActive &&
      "border-primary/60 bg-primary/5"
  )

  const instructionText = (() => {
    if (isUploading) {
      return "Uploading your image..."
    }

    if (isDragReject) {
      return "This file type is not allowed."
    }

    if (isDragActive) {
      return "Drop the image to upload"
    }

    if (hasSelection) {
      return "Image selected. Drop or browse to replace it."
    }

    return "Drag and drop an image, or click to choose one."
  })()

  const resolvedFileName = fileName || noFileText
  const maxFileSizeLabel =
    typeof maxFileSize === "number" && maxFileSize > 0
      ? `Maximum file size: ${formatBytes(maxFileSize)}`
      : null
  const maxFilesLabel =
    resolvedMaxFiles > 1
      ? `You can upload up to ${resolvedMaxFiles} files at a time.`
      : null

  const dropzoneErrorId = `${inputId}-dropzone-error`
  const serverErrorId = `${inputId}-upload-error`

  const handleButtonClick = () => {
    if (disabled || isUploading) {
      return
    }

    open()
  }

  return (
    <section
      className={cn("rounded-2xl border border-dashed p-5 sm:p-6", className)}
      aria-live={hasUploadError ? "assertive" : undefined}
    >
      {title ? (
        <Typography variant="h3" className="text-lg font-semibold">
          {title}
        </Typography>
      ) : null}
      {description ? (
        <div className="text-muted-foreground mt-2 text-sm">{description}</div>
      ) : null}

      <div
        className={cn(
          "mt-5 grid gap-6",
          showCurrentColumn ? "md:grid-cols-2" : undefined
        )}
      >
        {showCurrentColumn ? (
          <div className="space-y-3">
            <Typography
              variant="small"
              className="text-muted-foreground text-xs font-semibold tracking-wide uppercase"
            >
              {currentLabel}
            </Typography>
            <div className="bg-background/80 flex items-center justify-center rounded-xl border p-4">
              {currentPreview ?? (
                <span className="text-muted-foreground text-sm">
                  No image provided yet.
                </span>
              )}
            </div>
            {currentDescription ? (
              <div className="text-muted-foreground text-sm">
                {currentDescription}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-3">
          <Typography
            variant="small"
            className="text-muted-foreground text-xs font-semibold tracking-wide uppercase"
          >
            {previewLabel}
          </Typography>
          <div
            {...getRootProps({
              className: dropzoneClassName,
              "aria-disabled": disabled || isUploading,
              "aria-busy": isUploading,
              "aria-describedby": hasUploadError ? dropzoneErrorId : undefined,
            })}
          >
            <input
              {...inputPropsFromDropzone}
              className="sr-only"
              aria-hidden="true"
            />
            <Upload
              aria-hidden="true"
              className="text-muted-foreground size-8"
            />
            <div className="space-y-1">
              <p className="text-sm font-medium">{instructionText}</p>
              <p className="text-muted-foreground text-xs">
                {resolvedFileName}
              </p>
              {maxFileSizeLabel ? (
                <p className="text-muted-foreground text-xs">
                  {maxFileSizeLabel}
                </p>
              ) : null}
              {maxFilesLabel ? (
                <p className="text-muted-foreground text-xs">{maxFilesLabel}</p>
              ) : null}
              {accept ? (
                <p className="text-muted-foreground text-xs">
                  Accepted types: {accept}
                </p>
              ) : null}
            </div>
          </div>
          <div className="bg-background/80 flex items-center justify-center rounded-xl border p-4">
            {preview ?? (
              <span className="text-muted-foreground text-sm">
                No image selected yet.
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              id={buttonId}
              type="button"
              variant={buttonVariant}
              size={buttonSize}
              onClick={handleButtonClick}
              disabled={disabled || isUploading}
              aria-controls={inputId}
              aria-label={buttonAriaLabel ?? uploadLabel}
              aria-busy={isUploading}
            >
              <span className="inline-flex items-center gap-2">
                {isUploading ? (
                  <>
                    <Spinner size="sm" aria-hidden="true" />
                    <span>{uploadingLabel}</span>
                  </>
                ) : (
                  <span>{uploadLabel}</span>
                )}
              </span>
            </Button>
          </div>
          {previewDescription ? (
            <div className="text-muted-foreground text-sm">
              {previewDescription}
            </div>
          ) : null}
          {dropzoneError ? (
            <Alert id={dropzoneErrorId} variant="destructive">
              <AlertDescription>{dropzoneError}</AlertDescription>
            </Alert>
          ) : null}
          {error ? (
            <Alert id={serverErrorId} variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </div>
      </div>

      {helperText ? (
        <div className="text-muted-foreground mt-4 text-sm">{helperText}</div>
      ) : null}
    </section>
  )
}

const mergeRefs = <T,>(
  ...refs: Array<Ref<T> | undefined | null>
): ((value: T | null) => void) => {
  return (value) => {
    refs.forEach((ref) => {
      if (!ref) {
        return
      }

      if (typeof ref === "function") {
        ref(value)
      } else {
        ;(ref as MutableRefObject<T | null>).current = value
      }
    })
  }
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 bytes"
  }

  const units = ["bytes", "KB", "MB", "GB", "TB"] as const
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  )
  const value = bytes / Math.pow(1024, exponent)
  return `${value.toFixed(decimals)} ${units[exponent]}`
}

const formatRejectionError = (
  error: FileError,
  options: { maxFiles: number; maxFileSize?: number; accept?: string }
) => {
  switch (error.code) {
    case "file-too-large":
      return options.maxFileSize
        ? `Files must be smaller than ${formatBytes(options.maxFileSize)}.`
        : "The selected file is too large."
    case "file-invalid-type":
      return options.accept
        ? `Only files of type ${options.accept} are allowed.`
        : "The selected file type is not allowed."
    case "too-many-files":
      return options.maxFiles === 1
        ? "You can upload only one file."
        : `You can upload up to ${options.maxFiles} files.`
    default:
      return error.message
  }
}
