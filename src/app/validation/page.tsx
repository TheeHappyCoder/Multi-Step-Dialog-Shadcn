"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { MultiStepDialog } from "@/components/ui/multi-step-dialog"
import { Settings, CheckCircle, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ValidationPage() {
  const [open, setOpen] = React.useState(false)
  const [projectName, setProjectName] = React.useState("")

  // simple validation rule
  const canProceed = projectName.trim().length > 0

  // determine visual step states
  const stepStates = {
    general: canProceed ? ("complete" as const) : ("error" as const),
    confirm: "idle" as const,
  }

  const steps = [
    {
      id: "general",
      label: "General",
      description: "Enter project details",
      icon: <Settings className="w-4 h-4" />,
      state: stepStates.general,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">General Info</h3>
          <p className="text-sm text-muted-foreground">
            Please enter your project name to continue.
          </p>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name"
            className={cn(
              "border px-3 py-2 rounded-md w-full",
              canProceed
                ? "border-border focus:ring-2 focus:ring-primary/40"
                : "border-destructive/60"
            )}
          />
        </div>
      ),
    },
    {
      id: "confirm",
      label: "Confirm",
      description: "Finish setup",
      icon: <CheckCircle className="w-4 h-4" />,
      state: stepStates.confirm,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Confirmation</h3>
          <p className="text-sm text-muted-foreground">
            Your project{" "}
            <span className="font-medium">{projectName || "(unnamed)"}</span> has been set up!
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="flex items-center justify-center bg-background">
      <Button onClick={() => setOpen(true)}>
        Open Validation Multi-Step Dialog
      </Button>

      <MultiStepDialog
        open={open}
        onOpenChange={setOpen}
        steps={steps}
        canNavigateToStep={(targetId, currentId) => {
          // Prevent navigating forward if validation fails
          const ids = steps.map((s) => s.id)
          const currentIndex = ids.indexOf(currentId)
          const targetIndex = ids.indexOf(targetId)
          if (targetIndex <= currentIndex) return true
          return canProceed
        }}
      >
        <MultiStepDialog.Content>
          <MultiStepDialog.Header
            title="New Project"
            description="Fill out details before continuing."
          >
            {/* Inject our new progress bar at the top */}
            <MultiStepDialog.Progress />
          </MultiStepDialog.Header>

          <div className="flex flex-1 min-h-0">
            {/* Fully custom Sidebar using StepList + StepItem */}
            <MultiStepDialog.Sidebar>
              <MultiStepDialog.StepList>
                {steps.map((step) => (
                  <MultiStepDialog.StepItem key={step.id} step={step}>
                    {/* Custom indicator example */}
                    <StepIndicator state={step.state} />
                  </MultiStepDialog.StepItem>
                ))}
              </MultiStepDialog.StepList>
            </MultiStepDialog.Sidebar>

            <MultiStepDialog.Body />
          </div>

          <MultiStepDialog.Footer>
            {({ index, total, next, prev }) => (
              <>
                <div className="text-sm text-muted-foreground">
                  Step {index + 1} of {total}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={prev} disabled={index === 0}>
                    Back
                  </Button>
                  <Button onClick={next} disabled={index === 0 && !canProceed}>
                    {index === total - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              </>
            )}
          </MultiStepDialog.Footer>
        </MultiStepDialog.Content>
      </MultiStepDialog>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                               STEP INDICATOR                              */
/* -------------------------------------------------------------------------- */

function StepIndicator({
  state,
}: {
  state?: "idle" | "valid" | "error" | "complete"
}) {
  const base =
    "ml-auto inline-flex items-center justify-center w-2.5 h-2.5 rounded-full transition-all duration-300"

  // Default color styles
  const colors = {
    idle: "bg-muted-foreground/30",
    valid: "bg-primary/70",
    complete: "bg-green-500",
    error: "bg-destructive/70 animate-pulse",
  }[state ?? "idle"]

  // Render icon if step is completed
  if (state === "complete") {
    return (
      <span
        className={cn(
          base,
          "w-4 h-4",
          "flex items-center justify-center"
        )}
      >
        <CheckCircle className="w-7 h-7 text-green-500" />
      </span>
    )
  }

  return <span className={cn(base, colors)} />
}
