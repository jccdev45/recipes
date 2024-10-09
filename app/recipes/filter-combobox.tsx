import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Ingredient, Tag } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type FilterItem = Tag | Ingredient | string

interface FilterComboboxProps<T extends FilterItem> {
  items: T[]
  placeholder: string
  emptyText: string
  selectedItems: T[]
  onSelect: (value: T | null) => void
  getLabel: (item: T) => string
  getValue: (item: T) => string
}

export function FilterCombobox<T extends FilterItem>({
  items,
  placeholder,
  emptyText,
  selectedItems,
  onSelect,
  getLabel,
  getValue,
}: FilterComboboxProps<T>) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<T | null>(null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedItems.length > 0
            ? `${selectedItems.length} selected`
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={getValue(item)}
                  value={getValue(item)}
                  onSelect={() => onSelect(item)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedItems.some(
                        (selectedItem) =>
                          getValue(selectedItem) === getValue(item)
                      )
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {getLabel(item)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
