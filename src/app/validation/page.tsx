"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { MultiStepDialog } from "@/components/ui/multi-step-dialog"
import { Settings, CheckCircle } from "lucide-react"

export default function ValidationPage() {
  const [open, setOpen] = React.useState(false)
  const [projectName, setProjectName] = React.useState("")

  const canProceed = projectName.trim().length > 0

  const steps = [
    {
      id: "general",
      label: "General",
      description: "Enter project details",
      icon: <Settings className="w-4 h-4" />,
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
            className="border px-3 py-2 rounded-md w-full"
          />
        </div>
      ),
    },
    {
      id: "confirm",
      label: "Confirm",
      description: "Finish setup",
      icon: <CheckCircle className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Confirmation</h3>
          <p className="text-sm text-muted-foreground">
            Your project <span className="font-medium">{projectName}</span> has been set up!
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="flex items-center justify-center bg-background">
      <Button className="cursor-pointer" onClick={() => setOpen(true)}>Open Validation Multi-Step Dialog</Button>

      <MultiStepDialog
        open={open}
        onOpenChange={setOpen}
        steps={steps}
        canNavigateToStep={(targetId, currentId) => {
          // Block moving forward if Step 1 is incomplete
          const stepOrder = steps.map((s) => s.id)
          const currentIndex = stepOrder.indexOf(currentId)
          const targetIndex = stepOrder.indexOf(targetId)

          // Allow backwards always, forward only if validated
          if (targetIndex <= currentIndex) return true
          return canProceed
        }}
      >
        <MultiStepDialog.Content>
          <MultiStepDialog.Header
            title="New Project"
            description="Fill out details before continuing."
          />

          <div className="flex flex-1 min-h-0">
            <MultiStepDialog.Sidebar />
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
