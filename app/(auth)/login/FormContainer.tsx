"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { TypographyH1, TypographyP } from "@/components/ui/typography"

import { LoginForm } from "./LoginForm"
import { RegisterForm } from "./RegisterForm"

export default function FormContainer({ className }: { className?: string }) {
  const [view, setView] = useState("sign-in")
  const formStyle = `flex flex-col justify-center w-full gap-2 mx-auto shadow shadow-foreground/30 border border-border`

  return (
    <div className={cn(``, className)}>
      {view === "check-email" && (
        <TypographyH1>
          Check <span className="font-bold">your email</span> to continue
          signing up
        </TypographyH1>
      )}

      {view === "change-email" && (
        <TypographyH1>
          Your <span className="font-bold">email address</span> has been
          changed. A confirmation link has been sent to both your old and your
          new email.
        </TypographyH1>
      )}

      {view === "sign-in" && (
        <>
          <LoginForm className={cn(`px-4 py-12`, formStyle)} />
          <TypographyP className="text-center">
            Don't have an account?
            <Button
              variant="outline"
              className="mx-2 underline"
              onClick={() => setView("sign-up")}
            >
              Sign Up
            </Button>
          </TypographyP>
        </>
      )}

      {view === "sign-up" && (
        <>
          <RegisterForm
            setView={setView}
            type="register"
            className={cn(`p-4`, formStyle)}
          />
          <TypographyP className="text-center">
            Already have an account?
            <Button
              variant="outline"
              className="mx-2 underline"
              onClick={() => setView("sign-in")}
            >
              Sign In
            </Button>
          </TypographyP>
        </>
      )}
    </div>
  )
}
