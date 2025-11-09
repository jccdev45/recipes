import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FormInfoAlert } from "@/components/form-info-alert"

export function SubmissionChecklist() {
  return (
    <Card className="border-primary/20 bg-primary/5 shadow-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg font-semibold">
          Submission checklist
        </CardTitle>
        <CardDescription>Quick reminders before you publish.</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground space-y-3 text-sm">
        <ul className="grid list-disc gap-2 pl-5">
          <li>Double-check spelling and measurements for clarity.</li>
          <li>
            Group ingredients by component (batter, frosting) if your dish has
            multiple parts.
          </li>
          <li>
            Preview the generated slug from your title to ensure it reads well.
          </li>
          <li>
            {" "}
            Add an image after submitting to make the recipe stand out in search
            results.
          </li>
        </ul>
        <FormInfoAlert
          type="pause"
          title="Need to pause?"
          desc="Your recipe saves to your profile once submitted, so you can return and continue editing any time."
        />
      </CardContent>
    </Card>
  )
}
