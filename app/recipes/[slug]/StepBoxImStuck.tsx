"use client"

import React, { useState } from "react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type StepPropsImStuck = { className: string; id?: string; step: string }

export function StepBoxImStuck({ className, id, step }: StepPropsImStuck) {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <li
      // key={id}
      className={cn(
        `flex cursor-pointer items-center rounded-md transition-colors duration-200 p-2`,
        className,
        isChecked ? `bg-green-300 line-through` : `hover:bg-gray-300/80 `
      )}
      onClick={() => setIsChecked((isChecked) => !isChecked)}
    >
      <Checkbox checked={isChecked} className="m-0" />
      <Label
        // htmlFor={id}
        className="m-0 text-base cursor-pointer"
        onClick={() => setIsChecked((isChecked) => !isChecked)}
      >
        {step}
      </Label>
    </li>
  )
}
