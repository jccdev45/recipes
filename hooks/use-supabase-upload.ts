"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createClient } from "@/supabase/client"
import { useDropzone } from "react-dropzone"

import type { Accept, FileError, FileRejection } from "react-dropzone"

interface FileWithPreview extends File {
  preview?: string
  errors: FileError[]
}

export type UseSupabaseUploadOptions = {
  /**
   * Name of the bucket to upload files to in your Supabase project.
   */
  bucketName: string
  /**
   * Folder to upload files to in the specified bucket within your Supabase project.
   *
   * Defaults to uploading files to the root of the bucket (e.g. `test/my-file.png`).
   */
  path?: string
  /**
   * Allowed MIME types for each file upload (e.g. `image/png`). Wildcards are supported (e.g. `image/*`).
   *
   * Defaults to allowing uploads for all MIME types.
   */
  allowedMimeTypes?: string[]
  /**
   * Maximum upload size of each file allowed in bytes. (e.g. 1_000 bytes = 1 KB)
   */
  maxFileSize?: number
  /**
   * Maximum number of files allowed per upload.
   */
  maxFiles?: number
  /**
   * The number of seconds the asset is cached in the browser and in the Supabase CDN.
   *
   * This is set in the Cache-Control header. Defaults to 3600 seconds.
   */
  cacheControl?: number
  /**
   * When set to true, the file is overwritten if it exists.
   *
   * When set to false, an error is thrown if the object already exists. Defaults to `false`.
   */
  upsert?: boolean
  /**
   * Provides a way to customize the storage path for an uploaded file.
   * Receives the queued file and a suggested default path.
   */
  createFilePath?: (params: {
    file: FileWithPreview
    defaultPath: string
  }) => string
  /**
   * Invoked when a file upload succeeds.
   */
  onUploadComplete?: (params: { file: FileWithPreview; path: string }) => void
  /**
   * Invoked when a file upload fails.
   */
  onUploadError?: (params: { file: FileWithPreview; message: string }) => void
}

export type UseSupabaseUploadReturn = ReturnType<typeof useSupabaseUpload>

type UploadError = { name: string; message: string }

export type UploadResult =
  | { status: "success"; name: string; path: string }
  | { status: "error"; name: string; message: string }

function buildAcceptValue(
  allowedMimeTypes: string[] | undefined
): Accept | undefined {
  if (!allowedMimeTypes || allowedMimeTypes.length === 0) {
    return undefined
  }

  return allowedMimeTypes.reduce<Record<string, string[]>>(
    (accumulator, type) => {
      accumulator[type] = []
      return accumulator
    },
    {}
  )
}

const createFileWithPreview = (
  file: File,
  errors: FileError[]
): FileWithPreview => {
  const previewUrl = URL.createObjectURL(file)
  return Object.assign(file, {
    preview: previewUrl,
    errors,
  })
}

export function useSupabaseUpload(options: UseSupabaseUploadOptions) {
  const {
    bucketName,
    path,
    allowedMimeTypes = [],
    maxFileSize = Number.POSITIVE_INFINITY,
    maxFiles = 1,
    cacheControl = 3600,
    upsert = false,
    createFilePath,
    onUploadComplete,
    onUploadError,
  } = options

  const supabase = useMemo(() => createClient(), [])

  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<UploadError[]>([])
  const [successes, setSuccesses] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({})

  const filesRef = useRef<FileWithPreview[]>(files)

  const acceptValue = useMemo(
    () => buildAcceptValue(allowedMimeTypes),
    [allowedMimeTypes]
  )

  const updateFiles = useCallback(
    (
      updater: (previous: FileWithPreview[]) => FileWithPreview[]
    ): FileWithPreview[] => {
      let nextValue: FileWithPreview[] = filesRef.current

      setFiles((previous) => {
        nextValue = updater(previous)
        filesRef.current = nextValue
        return nextValue
      })

      return nextValue
    },
    []
  )

  const setQueuedFiles = useCallback(
    (
      value:
        | FileWithPreview[]
        | ((previous: FileWithPreview[]) => FileWithPreview[])
    ) => {
      if (typeof value === "function") {
        updateFiles(value as (previous: FileWithPreview[]) => FileWithPreview[])
        return
      }

      filesRef.current = value
      setFiles(value)
    },
    [updateFiles]
  )

  const mergeFiles = useCallback(
    (prepared: FileWithPreview[], options?: { replace?: boolean }) => {
      const { replace = false } = options ?? {}

      updateFiles((previous) => {
        const base = replace ? [] : previous
        const existingNames = new Set(base.map((file) => file.name))

        const next: FileWithPreview[] = [...base]

        prepared.forEach((fileWithPreview) => {
          if (existingNames.has(fileWithPreview.name)) {
            return
          }

          next.push(fileWithPreview)
          existingNames.add(fileWithPreview.name)
        })

        return next
      })
    },
    [updateFiles]
  )

  const addFiles = useCallback(
    (incoming: File[], options?: { replace?: boolean }) => {
      if (incoming.length === 0) {
        return
      }

      const prepared = incoming.map((file) => createFileWithPreview(file, []))

      mergeFiles(prepared, options)
    },
    [mergeFiles]
  )

  const isSuccess = useMemo(() => {
    if (
      errors.length === 0 &&
      successes.length === files.length &&
      files.length > 0
    ) {
      return true
    }

    return false
  }, [errors.length, successes.length, files.length])

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const preparedValid = acceptedFiles.map((file) =>
        createFileWithPreview(file, [])
      )

      const preparedInvalid = fileRejections.map(({ file, errors }) =>
        createFileWithPreview(file, [...errors])
      )

      mergeFiles([...preparedValid, ...preparedInvalid])
    },
    [mergeFiles]
  )

  const dropzoneProps = useDropzone({
    onDrop,
    noClick: true,
    accept: acceptValue,
    maxSize: maxFileSize,
    maxFiles,
    multiple: maxFiles !== 1,
  })

  const onUpload = useCallback(async (): Promise<
    UploadResult[] | undefined
  > => {
    if (!bucketName) {
      setErrors([{ name: "bucket", message: "Bucket name is required" }])
      return undefined
    }

    setLoading(true)

    try {
      const currentFiles = filesRef.current
      const filesWithErrors = errors.map((item) => item.name)
      const filesToUpload =
        filesWithErrors.length > 0
          ? [
              ...currentFiles.filter((file) =>
                filesWithErrors.includes(file.name)
              ),
              ...currentFiles.filter((file) => !successes.includes(file.name)),
            ]
          : currentFiles

      if (filesToUpload.length === 0) {
        setLoading(false)
        return []
      }

      const responses = await Promise.all(
        filesToUpload.map(async (file) => {
          const defaultPath = path ? `${path}/${file.name}` : file.name

          let storagePath = defaultPath

          if (createFilePath) {
            try {
              const candidate = createFilePath({
                file,
                defaultPath,
              })
              if (candidate && typeof candidate === "string") {
                storagePath = candidate
              }
            } catch (callbackError) {
              console.error(
                "Failed to derive Supabase storage path",
                callbackError
              )
            }
          }

          const { error, data } = await supabase.storage
            .from(bucketName)
            .upload(storagePath, file, {
              cacheControl: cacheControl.toString(),
              upsert,
              contentType: file.type || undefined,
            })

          if (error) {
            onUploadError?.({ file, message: error.message })
            return {
              status: "error" as const,
              name: file.name,
              message: error.message,
            }
          }

          const storedPath = data?.path ?? storagePath
          const normalizedPath = storedPath.startsWith("/")
            ? storedPath
            : `/${storedPath}`

          onUploadComplete?.({ file, path: normalizedPath })

          return {
            status: "success" as const,
            name: file.name,
            path: normalizedPath,
          }
        })
      )

      const responseErrors = responses.filter(
        (response): response is Extract<UploadResult, { status: "error" }> =>
          response.status === "error"
      )
      setErrors(responseErrors.map(({ name, message }) => ({ name, message })))

      const responseSuccesses = responses.filter(
        (response): response is Extract<UploadResult, { status: "success" }> =>
          response.status === "success"
      )

      if (responseSuccesses.length > 0) {
        setSuccesses((previous) =>
          Array.from(
            new Set([...previous, ...responseSuccesses.map(({ name }) => name)])
          )
        )

        setUploadedFiles((previous) => {
          const next = { ...previous }
          responseSuccesses.forEach(({ name, path: storagePath }) => {
            next[name] = storagePath
          })
          return next
        })
      }

      return responses
    } catch (error) {
      console.error("Unexpected error during Supabase upload", error)
      setErrors([
        { name: "upload", message: "Unexpected error uploading files" },
      ])
      return undefined
    } finally {
      setLoading(false)
    }
  }, [
    bucketName,
    cacheControl,
    errors,
    createFilePath,
    filesRef,
    path,
    successes,
    supabase,
    upsert,
    onUploadComplete,
    onUploadError,
  ])

  useEffect(() => {
    if (files.length === 0 && errors.length > 0) {
      setErrors([])
    }

    if (files.length <= maxFiles) {
      let changed = false

      const updatedFiles = files.map((file) => {
        const filteredErrors = file.errors.filter(
          (errorItem) => errorItem.code !== "too-many-files"
        )
        if (filteredErrors.length !== file.errors.length) {
          changed = true
          file.errors = filteredErrors
        }
        return file
      })

      if (changed) {
        setFiles(updatedFiles)
      }
    }
  }, [errors.length, files, maxFiles])

  useEffect(() => {
    const fileNames = new Set(files.map((file) => file.name))

    setErrors((previous) => {
      const filtered = previous.filter((item) => fileNames.has(item.name))
      return filtered.length === previous.length ? previous : filtered
    })

    setSuccesses((previous) => {
      const filtered = previous.filter((name) => fileNames.has(name))
      return filtered.length === previous.length ? previous : filtered
    })
  }, [files])

  useEffect(() => {
    filesRef.current = files
  }, [files])

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  const removeFile = useCallback(
    (fileName: string) => {
      updateFiles((previous) =>
        previous.filter((file) => file.name !== fileName)
      )
    },
    [updateFiles]
  )

  const reset = useCallback(() => {
    filesRef.current = []
    setFiles([])
    setErrors([])
    setSuccesses([])
    setUploadedFiles({})
  }, [])

  return {
    files,
    setFiles: setQueuedFiles,
    addFiles,
    removeFile,
    reset,
    successes,
    isSuccess,
    loading,
    errors,
    setErrors,
    onUpload,
    maxFileSize,
    maxFiles,
    allowedMimeTypes,
    uploadedFiles,
    ...dropzoneProps,
  }
}
