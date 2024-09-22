"use client"

import Link from "next/link"
import { User } from "@supabase/supabase-js"
import { useFormState } from "react-dom"
import { toast } from "sonner"

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
import { TypographyH2 } from "@/components/ui/typography"
import { signup } from "@/app/(auth)/actions"
import { AuthButton } from "@/app/(auth)/auth-button"
import { updateProfile } from "@/app/profile/actions"

const initialState = {
  message: "",
  errors: {},
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
  const action = formType === "edit" ? updateProfile : signup
  // const [state, formAction] = useFormState(action, initialState)

  const formItems =
    formType === "edit" ? registerFormItems.slice(1, -1) : registerFormItems

  // Display errors as toast notifications
  // if (state?.errors) {
  //   Object.entries(state.errors).forEach(([key, errors]) => {
  //     if (Array.isArray(errors)) {
  //       errors.forEach((error) => toast.error(error))
  //     }
  //   })
  // }

  const renderFormFields = () =>
    formItems.map(
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

        return (
          <div
            key={fieldName}
            className={cn(
              "col-span-2 space-y-1 *:text-lg md:col-span-1",
              fieldName === "email" && "md:col-span-2"
            )}
          >
            <Label htmlFor={fieldName}>{label}</Label>
            <Input
              id={fieldName}
              name={fieldName}
              type={type}
              placeholder={placeholder}
              required={required}
              defaultValue={value}
            />
          </div>
        )
      }
    )

  const renderFormActions = () =>
    formType === "register" ? (
      <AuthButton
        action={action}
        label={title}
        className="col-span-2 mx-auto w-1/2"
      />
    ) : (
      <div className="flex items-center gap-x-4">
        <AlertDialog>
          <Button asChild variant="destructive">
            <AlertDialogTrigger className="mx-auto w-1/4">
              Cancel
            </AlertDialogTrigger>
          </Button>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Any changes you may have made will be discarded. Do you still
                want to exit?
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Nah</AlertDialogCancel>
                <Button asChild variant="destructive">
                  <AlertDialogAction>
                    <Link href={`/profile/${userData?.id}`}>Yeah</Link>
                  </AlertDialogAction>
                </Button>
              </AlertDialogFooter>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
        <AuthButton action={action} label="Confirm" />
      </div>
    )

  return (
    <form className="m-base border bg-background p-8 shadow" autoComplete="off">
      <fieldset className="grid auto-cols-auto gap-4">
        <TypographyH2 className="col-span-2 mx-auto w-full text-center">
          {title}
        </TypographyH2>

        {renderFormFields()}

        {/* <div aria-live="polite" className="col-span-2">
          {state?.errors ? (
            Object.entries(state.errors).map(([field, errors]) =>
              Array.isArray(errors)
                ? errors.map((error) => (
                    <p
                      key={`${field}-${error}`}
                      className="text-red-500 border-b"
                    >
                      {error}
                    </p>
                  ))
                : null
            )
          ) : (
            <p>{state?.message}</p>
          )}
        </div> */}

        {renderFormActions()}
      </fieldset>
    </form>
  )
}
