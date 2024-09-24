"use client"

import { ReactNode, useState } from "react"

import { Step } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"

type StepsProps = {
  className: string
  steps: Step[]
}

export function Steps({ steps, className }: StepsProps) {
  return (
    <div className={cn(``, className)}>
      <Typography variant="h2">Steps</Typography>
      {/* TODO: ADD DRAGGABLE */}
      <Typography variant="list" className="flex flex-col">
        {steps.map(({ id, step }) => (
          <StepBoxImStuck key={id} id={id}>
            {step}
          </StepBoxImStuck>
        ))}
      </Typography>
    </div>
  )
}

type StepPropsImStuck = { id?: string; children: ReactNode }

function StepBoxImStuck({ id, children }: StepPropsImStuck) {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <li
      className={cn(
        `flex cursor-pointer items-center space-x-2 rounded-md p-2 transition-colors duration-200`,
        isChecked ? `bg-secondary line-through` : `hover:bg-muted`
      )}
      onClick={() => setIsChecked((isChecked) => !isChecked)}
    >
      <Checkbox name={id} id={id} checked={isChecked} className="m-0" />
      <Label
        htmlFor={id}
        className="m-0 cursor-pointer text-base"
        onClick={() => setIsChecked((isChecked) => !isChecked)}
      >
        {children}
      </Label>
    </li>
  )
}
