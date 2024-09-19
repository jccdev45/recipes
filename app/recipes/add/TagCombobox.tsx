import { useState } from "react"
import { Ingredient, Tag } from "@/supabase/types"
import { CheckIcon, ChevronsUpDown } from "lucide-react"
import { ControllerRenderProps } from "react-hook-form"

import { cn, genId } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { FormControl } from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// type TagProps = {
//   className: string
//   field: any
//   form: any
//   index: number
//   update: (index: number, obj: { id: string; tag: string }) => void
//   uniqueTags: Tag[]
// }
type RecipeFormComboboxProps = {
  className: string
  field: any
  index: number
  update: (
    index: number,
    tag?: { id: string; tag: string },
    ingredient?: {
      id: string
      amount: number
      unitMeasurement: string
      ingredient: string
    }
  ) => void
  items: Array<Tag['tag'] | Ingredient["unitMeasurement"]>
}

export function TagCombobox({
  className,
  field,
  index,
  update,
  items,
}: RecipeFormComboboxProps) {
  // const [tagValue, setTagValue] = useState("")
  const [value, setValue] = useState("")

  return (
    <Popover>
      <PopoverTrigger asChild className={cn(``, className)}>
        <FormControl>
          <Button variant="outline" className="justify-between" role="combobox">
            {field.value
              ? items.find((item) => item === field.value)?.toString()
              : "Select tag..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput className="h-9" placeholder="Search tags..." />
          <CommandEmpty>No tag found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.toString()}
                value={item.toString()}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  update(index, { id: genId(), tag: currentValue })
                }}
              >
                {item.toString()}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    item.toString() === field.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
