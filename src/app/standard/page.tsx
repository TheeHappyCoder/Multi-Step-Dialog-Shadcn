"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { MultiStepDialog } from "@/components/ui/multi-step-dialog"
import { Database, Settings, Shield } from "lucide-react"

// --- Dummy Step Components ---
function GeneralForm() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">General Settings</h3>
      <p className="text-sm text-muted-foreground">
        Configure general information about your project here.
      </p>
      <input
        type="text"
        placeholder="Project name"
        className="border px-3 py-2 rounded-md w-full"
      />
    </div>
  )
}

function DatabaseForm() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Database Configuration</h3>
      <p className="text-sm text-muted-foreground">
        Setup your database connection and credentials.
      </p>
      <input
        type="text"
        placeholder="Database URL"
        className="border px-3 py-2 rounded-md w-full"
      />
    </div>
  )
}

function AuthSettings() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Authentication</h3>
      <p className="text-sm text-muted-foreground">
        Manage authentication methods and user roles.
      </p>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          Enable magic link sign-in
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          Enable OAuth providers
        </label>
      </div>
    </div>
  )
}

// --- Page Component ---
export default function StandardPage() {
  const [open, setOpen] = React.useState(false)

  const steps = [
    {
      id: "general",
      label: "General",
      description: "Configure project basics",
      icon: <Settings className="w-4 h-4" />,
      content: <GeneralForm />,
    },
    {
      id: "database",
      label: "Database",
      description: "Setup and manage database",
      icon: <Database className="w-4 h-4" />,
      content: <DatabaseForm />,
    },
    {
      id: "auth",
      label: "Auth",
      description: "Manage authentication and roles",
      icon: <Shield className="w-4 h-4" />,
      content: <AuthSettings />,
    },
  ]

  return (
    <div className="flex items-center justify-center bg-background">
      <Button className="cursor-pointer" onClick={() => setOpen(true)}>Open Standard Multi-Step Dialog</Button>

      <MultiStepDialog open={open} onOpenChange={setOpen} steps={steps}>
        <MultiStepDialog.Content>
          <MultiStepDialog.Header
            title="Project Setup"
            description="Configure your project settings"
          />
          <div className="flex flex-1 min-h-0">
            <MultiStepDialog.Sidebar />
            <MultiStepDialog.Body />
          </div>
          <MultiStepDialog.Footer>
            {({ index, total, prev, next }) => (
              <>
                <div className="text-sm text-muted-foreground">
                  Step {index + 1} of {total}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={prev} disabled={index === 0}>
                    Back
                  </Button>
                  <Button onClick={next} disabled={index === total - 1}>
                    Next
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
