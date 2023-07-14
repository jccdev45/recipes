import { cn } from "@/lib/utils";
import { Step } from "@/types/supabase";

import { StepBoxImStuck } from "./StepBoxImStuck";

type StepsProps = {
  className: string;
  steps: Step[];
};

export function Steps({ steps, className }: StepsProps) {
  return (
    <div className={cn(`prose`, className)}>
      <h3>Steps</h3>
      {/* TODO: ADD DRAGGABLE */}
      <ol className="flex flex-col">
        {steps.map(({ id, step }) => (
          <StepBoxImStuck key={id} id={id} step={step} className="space-x-2" />
        ))}
      </ol>
    </div>
  );
}
