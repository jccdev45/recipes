"use client"

import { ReactNode } from "react"
import { Toaster } from "sonner"

import { ThemeProvider } from "@/components/theme-provider"

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Toaster />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </>
  )
}
