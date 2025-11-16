import { useState } from "react"
import { CheckIcon, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type ComboboxItem = string | { id?: string; tag: string }

type ComboboxProps = {
  className?: string
  id?: string
  value?: string
  onSelect: (value: ComboboxItem) => void
  items: ComboboxItem[]
  placeholder: string
  disabled?: boolean
  ariaInvalid?: boolean
  ariaDescribedBy?: string
}

export function FormCombobox({
  className,
  id,
  value,
  onSelect,
  items,
  placeholder,
  disabled,
  ariaInvalid,
  ariaDescribedBy,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={cn(className)} disabled={disabled}>
        <Button
          id={id}
          variant="outline"
          className="justify-between"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
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
                typeof item === "string" ? item : item.id || item.tag
              return (
                <CommandItem
                  key={itemId}
                  value={itemValue}
                  onSelect={(currentValue) => {
                    onSelect(
                      typeof item === "string"
                        ? currentValue
                        : { ...item, tag: currentValue }
                    )
                    setOpen(false)
                  }}
                >
                  {itemValue}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      itemValue === value ? "opacity-100" : "opacity-0"
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
