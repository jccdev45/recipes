"use client"

import { Dispatch, SetStateAction, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@supabase/supabase-js"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { userFormItems } from "@/lib/constants"
import { cn, trimAvatarUrl } from "@/lib/utils"
import { RegisterFormValues, RegisterSchema } from "@/lib/zod/schema"
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { TypographyH3 } from "@/components/ui/typography"
import { FileInput } from "@/app/recipes/add/ImageUpload"

type RegisterFormProps = {
  className: string
  setView?: Dispatch<SetStateAction<string>>
  type: "register" | "edit-profile"
  user?: User | null
}

export function RegisterForm({
  className,
  setView,
  type,
  user,
}: RegisterFormProps) {
  const supabase = createClient()

  const [imgURL, setImgURL] = useState("")
  const [authError, setAuthError] = useState("")
  const [uploadError, setUploadError] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues:
      type === "register"
        ? {
            email: "",
            password: "",
            confirm_password: "",
            first_name: "",
            last_name: "",
          }
        : {
            email: user?.email,
            password: "",
            confirm_password: "",
            first_name: user?.user_metadata.first_name,
            last_name: user?.user_metadata.last_name,
          },
    mode: "onChange",
  })

  const {
    formState: { errors, isValid, isDirty, isSubmitting, dirtyFields },
  } = form

  const registerSubmittable = !!isValid && !!isDirty
  const editSubmittable = !!isDirty && !!errors && !!isValid

  const handleImageUpload = async (file: File | null) => {
    if (!file) {
      return toast.warning("No file selected")
    }

    const fileExt = file?.name.split(".").pop()
    const filePath = `avatar/${Math.random()}.${fileExt}`
    let trimmedUpdatePath = ""

    if (type !== "register")
      trimmedUpdatePath = trimAvatarUrl(user?.user_metadata.avatar_url)

    try {
      setIsUploading(true)

      const fileOptions = {
        cacheControl: "3600",
        upsert: false,
      }

      if (type === "register") {
        const { data, error } = await supabase.storage
          .from("photos")
          .upload(filePath, file, fileOptions)

        if (error) {
          return toast.error("Something went wrong line 113", {
            description: error.message,
          })
        }

        setImgURL(data.path)
      } else {
        // TODO: FIX CHANGE PROFILE PICTURE
        const { data, error } = await supabase.storage
          .from("photos")
          .update(trimmedUpdatePath, file, fileOptions)

        if (error) {
          return toast.error("Something went wrong line 125", {
            description: error.message,
          })
        }
        setImgURL(data.path)
      }
    } catch (error) {
      setIsUploading(false)

      return toast.error("Something went wrong line 134", {
        description: (error as Error).message,
      })
    }

    setIsUploading(false)

    return toast.success("Image uploaded successfully")

    // if (file) {
    //   setIsUploading(true)

    //   const { data, error } =
    //     type === "register"
    //       ? await supabase.storage.from("photos").upload(filePath, file, {
    //           cacheControl: "3600",
    //           upsert: false,
    //         })
    //       : await supabase.storage
    //           .from("photos")
    //           .update(trimmedUpdatePath, file, {
    //             cacheControl: "3600",
    //             upsert: false,
    //           })

    //   if (error) {
    //     // setUploadError(error.message)
    //     return toast.error("Something went wrong", {
    //       description: error.message,
    //     })
    //   } else {
    //     setImgURL(data.path)
    //     setIsUploading(false)
    //     setUploadError("")

    //     return toast.success("Image uploaded successfully")
    //   }
    // } else {
    //   return toast("No file selected")
    // }
  }

  const handleSubmit = async (values: RegisterFormValues) => {
    const authValues = {
      email: values.email,
      password: values.password,
    }
    const dataValues = {
      data: {
        first_name: values.first_name,
        last_name: values.last_name,
        avatar_url:
          imgURL.length > 0
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${imgURL}`
            : `http://loremflickr.com/g/500/500/user`,
      },
    }

    const { data, error } =
      type === "register"
        ? await supabase.auth.signUp({
            ...authValues,
            options: {
              emailRedirectTo: `${location.origin}/auth/callback`,
              ...dataValues,
            },
          })
        : await supabase.auth.updateUser({
            ...authValues,
            ...dataValues,
          })

    if (data && type === "register") {
      setView && setView("check-email")
    }

    if (data && type === "edit-profile") {
      setView && setView("change-email")
    }

    if (error) {
      console.log(error)
      setAuthError(error.message)
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn(
          `rounded-lg border border-muted bg-background text-foreground shadow-sm shadow-muted dark:bg-stone-900`,
          className
        )}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <TypographyH3 className="text-center">
          {type === "register" ? `Sign Up` : `Edit Profile`}
        </TypographyH3>
        <div className="grid auto-cols-auto gap-2">
          {userFormItems.map(({ id, fieldName, placeholder, label }) => (
            <FormField
              key={id}
              control={form.control}
              // TODO: FIX THIS TYPE WEIRDNESS
              name={
                fieldName as
                  | "first_name"
                  | "last_name"
                  | "email"
                  | "confirm_password"
                  | "password"
              }
              render={({ field }) => (
                <FormItem
                  className={cn(
                    "col-span-2 lg:col-span-1",
                    fieldName === "email" && `lg:col-span-2`
                  )}
                >
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input
                      className="mb-6 rounded-md border bg-inherit px-4 py-2 shadow-inner"
                      placeholder={placeholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {imgURL.length > 0 ? (
          <Image
            width={200}
            height={200}
            objectFit="cover"
            src={imgURL}
            alt={form.getValues("first_name")}
          />
        ) : (
          ``
        )}

        <FileInput
          isUploading={isUploading}
          onFileChange={handleImageUpload}
          className="my-3 flex w-full items-center rounded-md border border-muted p-3"
        />
        {uploadError && <div>{uploadError}</div>}

        {type === "register" ? (
          <Button
            type="submit"
            disabled={!registerSubmittable || isSubmitting}
            className="mx-auto w-1/2"
          >
            Sign Up
          </Button>
        ) : (
          <>
            {/* <div className="flex items-center gap-x-1">
              Changes made to:{" "}
              {Object.keys(dirtyFields).map((field) => (
                <Badge key={field}>{field}</Badge>
              ))}
            </div> */}
            <div className="flex items-center gap-x-4">
              <AlertDialog>
                <Button asChild variant="secondary">
                  <AlertDialogTrigger className="mx-auto w-1/4">
                    Cancel
                  </AlertDialogTrigger>
                </Button>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Any changes you may have made will be discarded. Do you
                      still want to exit?
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Nah</AlertDialogCancel>
                      <Button asChild variant="destructive">
                        <AlertDialogAction>
                          <Link href={`/profile/${user?.id}`}>Yeah</Link>
                        </AlertDialogAction>
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogHeader>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                type="submit"
                disabled={!editSubmittable || isSubmitting}
                className="mx-auto w-1/3 md:w-1/4"
              >
                Update
              </Button>
            </div>
          </>
        )}
        {authError && <div>{authError}</div>}
      </form>
    </Form>
  )
}
