import { Loader2 } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export function ButtonLoading({ className }: { className: string }) {
  return (
    <Button disabled className={cn(``, className)}>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Please wait...
    </Button>
  );
}
