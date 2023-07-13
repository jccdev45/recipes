"use client";

import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { Button } from "@/components/ui/button";
import { RegisterForm } from "./RegisterForm";

export default function FormContainer() {
  const [view, setView] = useState("sign-in");

  return (
    <>
      {view === "check-email" && (
        <p className="text-center text-foreground">
          Check <span className="font-bold">your email</span> to continue
          signing up
        </p>
      )}

      {view === "sign-in" && (
        <>
          <LoginForm />
          <p className="my-4 text-sm text-center">
            Don't have an account?
            <Button
              variant="secondary"
              className="block mx-auto underline"
              onClick={() => setView("sign-up")}
            >
              Sign Up
            </Button>
          </p>
        </>
      )}

      {view === "sign-up" && (
        <>
          <RegisterForm setView={setView} />
          <p className="my-4 text-sm text-center">
            Already have an account?
            <Button
              variant="secondary"
              className="block mx-auto underline"
              onClick={() => setView("sign-in")}
            >
              Sign In
            </Button>
          </p>
        </>
      )}
    </>
  );
}
