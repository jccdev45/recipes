"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { LoginFormValues, LoginSchema } from "@/lib/zod/schema"
import { Button, buttonVariants } from "@/components/ui/button"
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
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  })
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const {
    formState: { errors, isValid, isDirty, isSubmitting },
  } = form

  const isSubmittable = !!isDirty

  const handleSignIn = async (values: LoginFormValues) => {
    setIsLoading(true)

    const supabase = createClient()

    const result = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (result.error) {
      setIsLoading(false)
      return toast.error("Something went wrong", {
        description: "There was a problem logging in, please try again",
      })
    }

    setIsLoading(false)
    router.push("/")
    router.refresh()
    // return redirect("/")
  }

  return (
    <Form {...form}>
      <form
        className={cn(
          `rounded-lg border border-muted bg-background text-foreground shadow-sm shadow-muted dark:bg-stone-900`,
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
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  className="mb-6 rounded-md border bg-inherit px-4 py-2"
                  placeholder="you@example.com"
                  {...field}
                />
              </FormControl>
              {errors?.email ? (
                <FormMessage className="text-xs" />
              ) : (
                <div className="h-2"></div>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  className="mb-6 rounded-md border bg-inherit px-4 py-2"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading || !isSubmittable || isSubmitting}
          className={cn(buttonVariants(), "mx-auto w-1/2")}
        >
          {isLoading && <Loader className="mr-2 size-4 animate-spin" />}
          Login
        </Button>
      </form>
    </Form>
  )
}
