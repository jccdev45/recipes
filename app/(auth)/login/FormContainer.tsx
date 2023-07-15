"use client";

import { useState } from 'react';

import { TypographyH1 } from '@/components/typography/TypographyH1';
import { TypographyP } from '@/components/typography/TypographyP';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export default function FormContainer({ className }: { className?: string }) {
  const [view, setView] = useState("sign-in");

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
          <LoginForm className="flex flex-col justify-center w-5/6 gap-2 px-4 py-12 mx-auto shadow-sm md:w-2/3 shadow-foreground" />
          <TypographyP className="text-center">
            Don't have an account?
            <Button
              variant="secondary"
              className="mx-auto underline"
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
            className="flex flex-col justify-center w-5/6 gap-2 p-4 mx-auto md:w-2/3"
          />
          <TypographyP className="text-center">
            Already have an account?
            <Button
              variant="secondary"
              className="mx-auto underline"
              onClick={() => setView("sign-in")}
            >
              Sign In
            </Button>
          </TypographyP>
        </>
      )}
    </div>
  );
}
