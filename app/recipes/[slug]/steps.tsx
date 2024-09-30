"use client"

import React, { useState } from "react"

import { Step } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"

interface StepsProps {
  className?: string
  steps: Step[]
}

interface StepItemProps {
  id?: string
  step: string
}

const StepItem = React.memo(({ id, step }: StepItemProps) => {
  const [isChecked, setIsChecked] = useState(false)

  const toggleChecked = () => setIsChecked((prev) => !prev)

  return (
    <li
      className={cn(
        "flex cursor-pointer items-center space-x-2 rounded-md p-2 transition-colors duration-200",
        isChecked
          ? "bg-pink-300 text-foreground line-through dark:bg-pink-700"
          : "hover:bg-muted"
      )}
      onClick={toggleChecked}
    >
      <Checkbox
        name={id}
        id={id}
        checked={isChecked}
        className="m-0"
        onCheckedChange={toggleChecked}
      />
      <Label htmlFor={id} className="m-0 cursor-pointer text-base">
        {step}
      </Label>
    </li>
  )
})

export function Steps({ steps, className }: StepsProps) {
  return (
    <div className={cn("", className)}>
      <Typography variant="h2">Steps</Typography>
      <Typography variant="list" className="mt-4 flex flex-col space-y-2">
        {steps.map(({ id, step }) => (
          <StepItem key={id} id={id} step={step} />
        ))}
      </Typography>
    </div>
  )
}
