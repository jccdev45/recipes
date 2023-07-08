import { Step } from "@/types/supabase";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

type StepsProps = {
  className: string;
  steps: Step[];
};

export function Steps({ steps, className }: StepsProps) {
  return (
    <div className={cn(`prose`, className)}>
      <h3>Steps</h3>
      <ul className="flex flex-col">
        {steps.map(({ id, step }) => (
          <li key={id}>
            <Checkbox id={id} />
            <Label htmlFor={id}>{step}</Label>
          </li>
        ))}
      </ul>
    </div>
  );
}
