"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Searchbar({ className }: { className?: string }) {
  const router = useRouter()
  const [value, setValue] = useState("")

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value)

  const handleSubmit = async () => {
    router.push(`/recipes/?search=${value}`)
  }

  return (
    <form className={cn(``, className)} action={handleSubmit}>
      <Label className="relative w-full">
        <Input
          type="search"
          value={value}
          className="mx-auto w-full border border-border placeholder:text-xs md:placeholder:text-base"
          placeholder="Search recipes, ingredients, etc.."
          onChange={handleChange}
        />
        <Search className="absolute right-8 top-1.5" />
      </Label>
    </form>
  )
}
