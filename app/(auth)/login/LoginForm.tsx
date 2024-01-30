"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { LoginFormValues, LoginSchema } from "@/lib/zod/schema"
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

export function LoginForm({ className }: { className?: string }) {
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  })

  const {
    formState: { errors, isValid, isDirty, isSubmitting },
  } = form

  const isSubmittable = !!isValid && !!isDirty

  const handleSignIn = async (values: LoginFormValues) => {
    const supabase = createClient()

    await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })
    router.push("/")
    router.refresh()

    // return redirect("/")
  }

  return (
    <Form {...form}>
      <form
        className={cn(
          `border border-muted shadow-sm shadow-muted rounded-lg bg-background dark:bg-stone-900 text-foreground`,
          className
        )}
        onSubmit={form.handleSubmit(handleSignIn)}
      >
        <TypographyH3 className="text-center">Login</TypographyH3>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  className="px-4 py-2 mb-6 border rounded-md bg-inherit"
                  placeholder="you@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="px-4 py-2 mb-6 border rounded-md bg-inherit"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={!isSubmittable || isSubmitting}
          className="w-1/2 mx-auto"
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}
