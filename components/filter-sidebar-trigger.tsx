"use client"

import { SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

export function FilterSidebarTrigger() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button onClick={toggleSidebar} variant="default" size="lg">
      <SlidersHorizontal /> Filters
    </Button>
  )
}
