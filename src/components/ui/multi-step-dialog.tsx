"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogFixedHeader,
} from "@/components/ui/dialog"

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                   */
/* -------------------------------------------------------------------------- */

export interface Step {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  content: React.ReactNode
}

interface MultiStepDialogContextValue {
  steps: Step[]
  activeStep: string
  goToStep: (id: string) => void
  next: () => void
  prev: () => void
  canNavigateToStep?: (targetId: string, currentId: string) => boolean
}

const MultiStepDialogContext =
  React.createContext<MultiStepDialogContextValue | null>(null)

function useMultiStepDialog() {
  const ctx = React.useContext(MultiStepDialogContext)
  if (!ctx)
    throw new Error("useMultiStepDialog must be used within <MultiStepDialog>")
  return ctx
}

/* -------------------------------------------------------------------------- */
/*                                 PROPS API                                 */
/* -------------------------------------------------------------------------- */

export interface MultiStepDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  steps: Step[]
  initialStep?: string
  children: React.ReactNode

  /**
   * Optional guard function. Returning `false` will block navigation.
   * Runs whenever a user attempts to change steps (via next, prev, or sidebar click).
   */
  canNavigateToStep?: (targetId: string, currentId: string) => boolean
}

/* -------------------------------------------------------------------------- */
/*                                 ROOT WRAPPER                              */
/* -------------------------------------------------------------------------- */

export function MultiStepDialog({
  open,
  onOpenChange,
  steps,
  initialStep,
  canNavigateToStep,
  children,
}: MultiStepDialogProps) {
  const first = initialStep ?? steps?.[0]?.id
  const [activeStep, setActiveStep] = React.useState(first)
  
  // Keep in sync if the parent changes `initialStep`
  React.useEffect(() => {
    if (initialStep && initialStep !== activeStep) {
      setActiveStep(initialStep)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStep])

  // Reset if current activeStep is no longer valid (e.g. steps array changes)
  React.useEffect(() => {
    if (!steps.find((s) => s.id === activeStep)) {
      setActiveStep(steps[0]?.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps])

  const goToStep = React.useCallback(
    (id: string) => {
      if (!canNavigateToStep || canNavigateToStep(id, activeStep)) {
        setActiveStep(id)
      }
    },
    [canNavigateToStep, activeStep]
  )

  const index = steps.findIndex((s) => s.id === activeStep)

  const next = React.useCallback(() => {
    if (index < steps.length - 1) {
      const targetId = steps[index + 1].id
      if (!canNavigateToStep || canNavigateToStep(targetId, activeStep)) {
        setActiveStep(targetId)
      }
    }
  }, [index, steps, canNavigateToStep, activeStep])

  const prev = React.useCallback(() => {
    if (index > 0) {
      const targetId = steps[index - 1].id
      if (!canNavigateToStep || canNavigateToStep(targetId, activeStep)) {
        setActiveStep(targetId)
      }
    }
  }, [index, steps, canNavigateToStep, activeStep])

  return (
    <MultiStepDialogContext.Provider
      value={{ steps, activeStep, goToStep, next, prev, canNavigateToStep }}
    >
      <Dialog open={open} onOpenChange={onOpenChange}>
        {children}
      </Dialog>
    </MultiStepDialogContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 CONTENT                                   */
/* -------------------------------------------------------------------------- */

MultiStepDialog.Content = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      {...props}
      className={cn(
        "fixed top-1/2 left-1/2 z-50 translate-x-[-50%] translate-y-[-50%]",
        "flex flex-col w-full max-w-6xl h-[85vh] overflow-hidden rounded-lg border bg-background shadow-xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
        className
      )}
    >
      <VisuallyHidden>
        <DialogPrimitive.Title>Dialog</DialogPrimitive.Title>
      </VisuallyHidden>

      {/* Close button */}
      <DialogPrimitive.Close asChild>
        <button
          type="button"
          className="absolute top-4 right-4 z-50 flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </button>
      </DialogPrimitive.Close>

      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
))
MultiStepDialog.Content.displayName = "MultiStepDialog.Content"

/* -------------------------------------------------------------------------- */
/*                                  HEADER                                   */
/* -------------------------------------------------------------------------- */

MultiStepDialog.Header = function Header({
  title,
  description,
  action,
  className,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn("shrink-0 sticky top-0 z-20 border-b bg-background", className)}
    >
      <div className="px-6 pt-6 pb-4">
        <DialogFixedHeader
          title={title}
          description={description}
          action={action}
        />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  SIDEBAR                                  */
/* -------------------------------------------------------------------------- */

MultiStepDialog.Sidebar = function Sidebar({ className }: { className?: string }) {
  const { steps } = useMultiStepDialog()
  return (
    <aside
      className={cn("shrink-0 w-64 border-r bg-muted/30 overflow-y-auto", className)}
    >
      <nav className="flex flex-col">
        {steps.map((step) => (
          <MultiStepDialog.Step key={step.id} step={step} />
        ))}
      </nav>
    </aside>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 STEP BUTTON                               */
/* -------------------------------------------------------------------------- */

MultiStepDialog.Step = function Step({ step }: { step: Step }) {
  const { steps, activeStep, goToStep, canNavigateToStep } = useMultiStepDialog()
  const currentIndex = steps.findIndex((s) => s.id === activeStep)
  const targetIndex = steps.findIndex((s) => s.id === step.id)
  const isActive = activeStep === step.id

  // Determine if this step is navigable
  const disabled =
    !!canNavigateToStep &&
    !canNavigateToStep(step.id, activeStep) &&
    targetIndex > currentIndex

  return (
    <button
      disabled={disabled}
      onClick={() => goToStep(step.id)}
      className={cn(
        "group flex flex-col items-start gap-1 px-4 py-4 text-sm w-full text-left border-b transition-colors",
        disabled
          ? "opacity-50 cursor-not-allowed text-muted-foreground"
          : "hover:bg-muted/70 focus:bg-muted focus:outline-none",
        isActive && !disabled
          ? "bg-muted text-foreground font-medium"
          : !disabled
          ? "text-muted-foreground"
          : ""
      )}
    >
      <div className="flex items-center gap-2 font-medium">
        {step.icon && <span className="w-4 h-4 text-foreground/80">{step.icon}</span>}
        <span>{step.label}</span>
      </div>
      {step.description && (
        <span
          className={cn(
            "text-xs text-muted-foreground/80",
            !disabled && "group-hover:text-foreground/70"
          )}
        >
          {step.description}
        </span>
      )}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    BODY                                   */
/* -------------------------------------------------------------------------- */

MultiStepDialog.Body = function Body({ className }: { className?: string }) {
  const { steps, activeStep } = useMultiStepDialog()
  const current = steps.find((s) => s.id === activeStep)
  return (
    <main className={cn("flex-1 flex flex-col overflow-hidden", className)}>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {current?.content ?? (
          <p className="text-sm text-muted-foreground">No content for this step.</p>
        )}
      </div>
    </main>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   FOOTER                                  */
/* -------------------------------------------------------------------------- */

MultiStepDialog.Footer = function Footer({
  className,
  children,
}: {
  className?: string
  children?:
    | React.ReactNode
    | ((info: {
        index: number
        total: number
        activeStep: string
        next: () => void
        prev: () => void
        goToStep: (id: string) => void
      }) => React.ReactNode)
}) {
  const { steps, activeStep, next, prev, goToStep } = useMultiStepDialog()
  const index = steps.findIndex((s) => s.id === activeStep)
  const total = steps.length

  return (
    <div
      className={cn(
        "border-t bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        "px-6 py-4 flex items-center justify-between",
        className
      )}
    >
      {typeof children === "function"
        ? children({ index, total, activeStep, next, prev, goToStep })
        : children}
    </div>
  )
}
