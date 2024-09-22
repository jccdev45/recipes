import { useState } from "react"
import { CheckIcon, ChevronsUpDown } from "lucide-react"
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form"

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

type ComboboxItem = string | { id?: string; tag: string }

type ComboboxProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  className: string
  field: ControllerRenderProps<TFieldValues, TName>
  index: number
  update: (index: number, value: ComboboxItem) => void
  items: ComboboxItem[]
  placeholder: string
}

export function FormCombobox<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  className,
  field,
  index,
  update,
  items,
  placeholder,
}: ComboboxProps<TFieldValues, TName>) {
  const [value, setValue] = useState("")

  return (
    <Popover>
      <PopoverTrigger asChild className={cn(``, className)}>
        <FormControl>
          <Button variant="outline" className="justify-between" role="combobox">
            {field.value || placeholder}
            <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            className="h-9"
            placeholder={`Search ${placeholder.toLowerCase()}...`}
          />
          <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => {
              const itemValue = typeof item === "string" ? item : item.tag
              const itemId =
                typeof item === "string" ? genId() : item.id || genId()
              return (
                <CommandItem
                  key={itemId}
                  value={itemValue}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    update(
                      index,
                      typeof item === "string"
                        ? currentValue
                        : { id: itemId, tag: currentValue }
                    )
                  }}
                >
                  {itemValue}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      itemValue === field.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
