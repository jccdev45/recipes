"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function Searchbar({ className }: { className?: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 250);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);

  // useEffect(() => {
  //   router.push(`/recipes/?search=${value}`);
  // }, [debouncedValue]);

  const handleSubmit = async () => {
    router.push(`/recipes/?search=${value}`);
  };

  return (
    <form className={cn(``, className)} action={handleSubmit}>
      <Label className="relative w-full">
        <Input
          type="search"
          value={value}
          className="w-full mx-auto border border-border placeholder:text-xs md:placeholder:text-base"
          placeholder="Search recipes, ingredients, etc.."
          onChange={handleChange}
        />
        <Search className="absolute top-1.5 right-8" />
      </Label>
    </form>
  );
}
