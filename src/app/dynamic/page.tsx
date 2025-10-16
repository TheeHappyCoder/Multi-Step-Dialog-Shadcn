"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { MultiStepDialog } from "@/components/ui/multi-step-dialog"
import { Pencil, DollarSign, ArrowLeftRight } from "lucide-react"

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

  const canNavigateToStep = (target: string, current: string) => {
    const order = ["names", "amounts", "directions"]
    const cur = order.indexOf(current)
    const next = order.indexOf(target)

    // Always allow backward
    if (next <= cur) return true

    // Prevent moving forward unless validated
    if (current === "names" && !allNamed) return false
    if (current === "amounts" && !allAmounts) return false
    return true
  }

  // --- Step 1: Name Transactions ---
  const NameStep = (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Step 1: Assign Names</h3>
      <p className="text-sm text-muted-foreground">
        Give each transaction a name.
      </p>
      <div className="space-y-4">
        {transactions.map((t, i) => (
          <div key={t.id} className="flex items-center gap-2">
            <input
              type="text"
              value={t.name}
              onChange={(e) => {
                const updated = [...transactions]
                updated[i].name = e.target.value
                setTransactions(updated)
              }}
              placeholder={`Transaction ${t.id} name`}
              className="border rounded-md px-3 py-2 flex-1"
            />
            <span className="text-sm text-muted-foreground">
              {t.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  // --- Step 2: Amounts ---
  const AmountStep = (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Step 2: Enter Amounts</h3>
      <p className="text-sm text-muted-foreground">
        Enter an amount for each transaction.
      </p>
      <div className="space-y-4">
        {transactions.map((t, i) => (
          <div key={t.id} className="flex items-center gap-2">
            <input
              type="number"
              value={t.amount || ""}
              onChange={(e) => {
                const updated = [...transactions]
                updated[i].amount = Number(e.target.value)
                setTransactions(updated)
              }}
              placeholder={`Amount for ${t.name || "transaction"}`}
              className="border rounded-md px-3 py-2 flex-1"
            />
            <span className="text-sm text-muted-foreground">
              {t.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  // --- Step 3: Direction ---
  const DirectionStep = (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Step 3: Direction</h3>
      <p className="text-sm text-muted-foreground">
        Mark each transaction as incoming or outgoing.
      </p>
      <div className="space-y-4">
        {transactions.map((t, i) => (
          <div key={t.id} className="flex items-center gap-4">
            <span className="w-32 text-sm font-medium">
              {t.name || `Transaction ${t.id}`}
            </span>
            <select
              value={t.direction}
              onChange={(e) => {
                const updated = [...transactions]
                updated[i].direction = e.target.value
                setTransactions(updated)
              }}
              className="border rounded-md px-2 py-2"
            >
              <option value="">Select...</option>
              <option value="in">Incoming</option>
              <option value="out">Outgoing</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )

  const steps = [
    {
      id: "names",
      label: "Names",
      description: "Assign names to transactions",
      icon: <Pencil className="w-4 h-4" />,
      content: NameStep,
    },
    {
      id: "amounts",
      label: "Amounts",
      description: "Enter the amounts",
      icon: <DollarSign className="w-4 h-4" />,
      content: AmountStep,
    },
    {
      id: "directions",
      label: "Directions",
      description: "Set incoming or outgoing",
      icon: <ArrowLeftRight className="w-4 h-4" />,
      content: DirectionStep,
    },
  ]

  return (
    <div className="flex items-center justify-center bg-background">
      <Button className="cursor-pointer" onClick={() => setOpen(true)}>Open Dynamic Multi-Step Dialog</Button>

      <MultiStepDialog
        open={open}
        onOpenChange={setOpen}
        steps={steps}
        canNavigateToStep={canNavigateToStep}
      >
        <MultiStepDialog.Content>
          <MultiStepDialog.Header
            title="Transaction Setup"
            description="Review and confirm your transaction details."
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
