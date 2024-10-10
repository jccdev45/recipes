"use client"

import Link from "next/link"

import { registerFormItems } from "@/lib/constants"
import { cn } from "@/lib/utils"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import { signup, updateProfile } from "@/app/(auth)/actions"
import { AuthButton } from "@/app/(auth)/auth-button"

import type { User } from "@supabase/supabase-js"

interface UserProfileFormProps {
  title: string
  formType: "register" | "edit"
  userData?: User
}

interface FormFieldsProps {
  formType: "register" | "edit"
  userData?: User
}

interface FormActionsProps {
  formType: "register" | "edit"
  title: string
  userData?: User
}

export function UserProfileForm({
  title,
  formType,
  userData,
}: UserProfileFormProps) {
  return (
    <form
      className="rounded border bg-background p-8 drop-shadow"
      autoComplete="off"
      aria-labelledby="form-title"
    >
      <Typography variant="h2">{title}</Typography>
      <fieldset className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <legend className="sr-only">User Profile Information</legend>
        <FormFields formType={formType} userData={userData} />
        <FormActions formType={formType} title={title} userData={userData} />
      </fieldset>
    </form>
  )
}

function FormFields({ formType, userData }: FormFieldsProps) {
  return (
    <>
      {registerFormItems.map(
        ({
          type,
          fieldName,
          placeholder,
          label,
          required = formType === "edit" ? false : true,
        }) => {
          const value =
            formType === "edit"
              ? userData?.user_metadata[fieldName]
              : fieldName === "email"
                ? userData?.email
                : ""

          const inputId = `${fieldName}-input`

          return (
            <div
              key={fieldName}
              className={cn(
                "space-y-1",
                fieldName === "email" ||
                  fieldName === "password" ||
                  fieldName === "confirm_password"
                  ? "md:col-span-2"
                  : "md:col-span-1"
              )}
            >
              <Label htmlFor={inputId} className="text-sm font-medium">
                {label}
              </Label>
              <Input
                id={inputId}
                name={fieldName}
                type={type}
                placeholder={placeholder}
                required={required}
                defaultValue={value}
                className="w-full"
                aria-describedby={`${inputId}-error`}
              />
              <div
                id={`${inputId}-error`}
                aria-live="polite"
                className="text-sm text-red-500"
              ></div>
            </div>
          )
        }
      )}
    </>
  )
}

function FormActions({ formType, title, userData }: FormActionsProps) {
  return (
    <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row md:col-span-2">
      {formType === "register" ? (
        <AuthButton label={title} className="w-full sm:w-1/2" action={signup} />
      ) : (
        <>
          <CancelButton userData={userData} />
          <AuthButton
            label="Confirm"
            action={updateProfile}
            className="w-full sm:w-1/2"
          />
        </>
      )}
    </div>
  )
}

function CancelButton({ userData }: { userData?: User }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full sm:w-1/4">
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
            <Button variant="destructive">
              <Link href={`/profile/${userData?.id}`}>
                Yes, discard changes
              </Link>
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
