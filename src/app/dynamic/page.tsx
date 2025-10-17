"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { MultiStepDialog } from "@/components/ui/multi-step-dialog"
import { Pencil, DollarSign, ArrowLeftRight, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DynamicPage() {
  const [open, setOpen] = React.useState(false)

  const [transactions, setTransactions] = React.useState([
    { id: 1, name: "", category: "Groceries", amount: 0, direction: "" },
    { id: 2, name: "", category: "Dining", amount: 0, direction: "" },
    { id: 3, name: "", category: "Travel", amount: 0, direction: "" },
  ])

  // --- Validation Logic ---
  const allNamed = transactions.every((t) => t.name.trim() !== "")
  const allAmounts = transactions.every((t) => t.amount > 0)
  const allDirections = transactions.every(
    (t) => t.direction === "in" || t.direction === "out"
  )

  // Unlock logic: only next step is allowed, not all future steps
  const canNavigateToStep = (target: string, current: string) => {
    const order = ["names", "amounts", "directions"]
    const cur = order.indexOf(current)
    const next = order.indexOf(target)

    // always allow backward
    if (next <= cur) return true

    // step 1 unlocks only step 2
    if (current === "names" && !allNamed) return false
    if (current === "names" && next > cur + 1) return false

    // step 2 unlocks only step 3
    if (current === "amounts" && !allAmounts) return false
    if (current === "amounts" && next > cur + 1) return false

    return true
  }

  /* -------------------------------------------------------------------------- */
  /*                              STEP COMPONENTS                              */
  /* -------------------------------------------------------------------------- */

  const NameStep = (
    <StepSection
      title="Step 1: Assign Names"
      description="Give each transaction a descriptive name."
    >
      {transactions.map((t, i) => (
        <div key={t.id} className="flex items-center gap-3">
          <input
            type="text"
            value={t.name}
            onChange={(e) => {
              const updated = [...transactions]
              updated[i].name = e.target.value
              setTransactions(updated)
            }}
            placeholder={`Transaction ${t.id} name`}
            className="border bg-background rounded-md px-3 py-2 flex-1 transition-all focus:ring-2 focus:ring-primary/40"
          />
          <span className="text-xs text-muted-foreground font-medium">
            {t.category}
          </span>
        </div>
      ))}
    </StepSection>
  )

  const AmountStep = (
    <StepSection
      title="Step 2: Enter Amounts"
      description="Provide amounts for each transaction."
    >
      {transactions.map((t, i) => (
        <div key={t.id} className="flex items-center gap-3">
          <input
            type="number"
            value={t.amount || ""}
            onChange={(e) => {
              const updated = [...transactions]
              updated[i].amount = Number(e.target.value)
              setTransactions(updated)
            }}
            placeholder={`Amount for ${t.name || "transaction"}`}
            className="border bg-background rounded-md px-3 py-2 flex-1 transition-all focus:ring-2 focus:ring-primary/40"
          />
          <span className="text-xs text-muted-foreground font-medium">
            {t.category}
          </span>
        </div>
      ))}
    </StepSection>
  )

  const DirectionStep = (
    <StepSection
      title="Step 3: Direction"
      description="Mark each transaction as incoming or outgoing."
    >
      {transactions.map((t, i) => (
        <div key={t.id} className="flex items-center gap-4">
          <span className="w-32 text-sm font-medium text-foreground/90">
            {t.name || `Transaction ${t.id}`}
          </span>
          <select
            value={t.direction}
            onChange={(e) => {
              const updated = [...transactions]
              updated[i].direction = e.target.value
              setTransactions(updated)
            }}
            className="border bg-background rounded-md px-2 py-2 flex-1 transition-all focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Select...</option>
            <option value="in">Incoming</option>
            <option value="out">Outgoing</option>
          </select>
        </div>
      ))}
    </StepSection>
  )

  const steps = [
    {
      id: "names",
      label: "Names",
      description: "Assign names",
      icon: <Pencil className="w-4 h-4" />,
      content: NameStep,
    },
    {
      id: "amounts",
      label: "Amounts",
      description: "Enter values",
      icon: <DollarSign className="w-4 h-4" />,
      content: AmountStep,
    },
    {
      id: "directions",
      label: "Directions",
      description: "Define type",
      icon: <ArrowLeftRight className="w-4 h-4" />,
      content: DirectionStep,
    },
  ]

  return (
    <div className="flex items-center justify-center bg-background">
      <Button
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Open Dynamic Multi-Step Dialog
      </Button>

      <MultiStepDialog
        open={open}
        onOpenChange={setOpen}
        steps={steps}
        canNavigateToStep={canNavigateToStep}
      >
        <MultiStepDialog.Content>
          <MultiStepDialog.Header
            title="Transaction Setup"
            description="Configure and validate your transaction details."
          >
            <MultiStepDialog.Progress className="bg-muted/40" />
          </MultiStepDialog.Header>

          <div className="flex flex-1 min-h-0">
            <MultiStepDialog.Sidebar>
              <MultiStepDialog.StepList>
                {steps.map((step, index) => {
                  const state =
                    index === 0 && allNamed
                      ? "complete"
                      : index === 1 && allAmounts
                      ? "complete"
                      : index === 2 && allDirections
                      ? "complete"
                      : "idle"

                  return (
                    <MultiStepDialog.StepItem key={step.id} step={step}>
                      <StepIndicator state={state} />
                    </MultiStepDialog.StepItem>
                  )
                })}
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
                  <Button
                    onClick={next}
                    disabled={
                      (index === 0 && !allNamed) ||
                      (index === 1 && !allAmounts) ||
                      (index === total - 1 && !allDirections)
                    }
                  >
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
/*                              STEP WRAPPER UI                               */
/* -------------------------------------------------------------------------- */

function StepSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div>
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              STEP INDICATOR                                */
/* -------------------------------------------------------------------------- */

function StepIndicator({
  state,
}: {
  state?: "idle" | "valid" | "error" | "complete"
}) {
  const base =
    "ml-auto flex items-center justify-center w-4 h-4 rounded-full transition-all duration-300"
  const colors = {
    idle: "bg-muted-foreground/30",
    valid: "bg-primary/70",
    error: "bg-destructive/70",
    complete: "text-green-500",
  }[state ?? "idle"]

  if (state === "complete") {
    return (
      <span className={cn(base, colors)}>
        <CheckCircle2 className="w-7 h-7" />
      </span>
    )
  }

  return <span className={cn(base, colors)} />
}
