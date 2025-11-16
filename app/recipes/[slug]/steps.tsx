"use client"

import React, { useId, useMemo, useState } from "react"

import { Step } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface StepsProps {
  className?: string
  steps: Step[]
}

interface StepItemProps {
  id?: string
  index: number
  step: string
}

const StepItem = React.memo(({ id, index, step }: StepItemProps) => {
  const generatedId = useId()
  const checkboxId = id ?? `step-${index}-${generatedId}`
  const [isChecked, setIsChecked] = useState(false)

  const toggleChecked = () => setIsChecked((prev) => !prev)

  const handleItemClick = () => {
    toggleChecked()
  }

  const stepText = `${index + 1}) ${step}`

  return (
    <li
      className={cn(
        "flex items-start gap-3 py-3",
        isChecked && "text-muted-foreground"
      )}
      onClick={handleItemClick}
    >
      <Checkbox
        id={checkboxId}
        checked={isChecked}
        onCheckedChange={(checked) => setIsChecked(checked === true)}
        onClick={(event) => {
          event.stopPropagation()
        }}
        className="mt-1 shrink-0"
      />
      <Label
        htmlFor={checkboxId}
        className={cn(
          "cursor-pointer text-base leading-relaxed",
          isChecked && "line-through"
        )}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          toggleChecked()
        }}
      >
        {stepText}
      </Label>
    </li>
  )
})
StepItem.displayName = "StepItem"

export function Steps({ steps, className }: StepsProps) {
  const items = useMemo(() => steps ?? [], [steps])

  return (
    <section id="recipe-steps" className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Steps</h2>
        <p className="text-muted-foreground text-sm">
          Check off items as you go to keep your place.
        </p>
      </div>
      <div className="relative">
        <ScrollArea className="max-h-[420px] pr-3">
          <ol className="divide-border/70 divide-y">
            {items.map(({ id, step }, index) => (
              <StepItem
                key={id ?? `step-${index}`}
                id={id}
                index={index}
                step={step}
              />
            ))}
          </ol>
        </ScrollArea>
      </div>
    </section>
  )
}
