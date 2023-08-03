import { TypographyH3 } from "@/components/typography/TypographyH3";
import { TypographyList } from "@/components/typography/TypographyList";
import { cn } from "@/lib/utils";
import { Step } from "@/types/supabase";

import { StepBoxImStuck } from "./StepBoxImStuck";

type StepsProps = {
  className: string;
  steps: Step[];
};

export function Steps({ steps, className }: StepsProps) {
  return (
    <div className={cn(``, className)}>
      <TypographyH3>Steps</TypographyH3>
      {/* TODO: ADD DRAGGABLE */}
      <TypographyList className="flex flex-col">
        {steps.map(({ id, step }) => (
          <StepBoxImStuck key={id} id={id} step={step} className="space-x-2" />
        ))}
      </TypographyList>
    </div>
  );
}
