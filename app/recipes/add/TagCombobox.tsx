import { useState } from "react"
import { Tag } from "@/supabase/types"
import { CheckIcon, ChevronsUpDown } from "lucide-react"

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

type TagProps = {
  className: string
  field: any
  form: any
  index: number
  update: (index: number, obj: { id: string; tag: string }) => void
  uniqueTags: Tag[]
}

export function TagCombobox({
  className,
  field,
  form,
  index,
  update,
  uniqueTags,
}: TagProps) {
  const [tagValue, setTagValue] = useState("")

  return (
    <Popover>
      <PopoverTrigger asChild className={cn(``, className)}>
        <FormControl>
          <Button variant="outline" className="justify-between" role="combobox">
            {field.value
              ? uniqueTags.find(({ tag }) => tag === field.value)?.tag
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
            {uniqueTags.map(({ tag, id }) => (
              <CommandItem
                key={id}
                value={tag}
                onSelect={(currentValue) => {
                  setTagValue(currentValue === tagValue ? "" : currentValue)
                  update(index, { id: genId(), tag: currentValue })
                  // setTagOpen(false);
                }}
              >
                {tag}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    tag === field.value ? "opacity-100" : "opacity-0"
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
