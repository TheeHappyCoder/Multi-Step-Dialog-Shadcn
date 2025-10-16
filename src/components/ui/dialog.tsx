"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"
import clsx, { type ClassValue } from "clsx"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function hasWidthOrMaxWidth(className?: string) {
  return /\bw-\[|\bw-[\w-]+|\bmax-w-\[|\bmax-w-[\w-]+/.test(className ?? "")
}

function Dialog({
  open,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  React.useEffect(() => {
    if (!open) {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
      document.body.removeAttribute("data-scroll-locked");
    }
  }, [open]);

  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      open={open}
      onOpenChange={onOpenChange}
      {...props}
    />
  );
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      className={cn(
        "absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full",
        "bg-muted text-foreground opacity-80 transition hover:opacity-100",
        "focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer",
        // Enhancements for light mode visibility
        "shadow-md hover:shadow-lg",
        "light:bg-gray-200 light:text-black light:hover:bg-gray-300"
      )}
      {...props}
    >
      <XIcon className="w-4 h-4" />
      <span className="sr-only">Close</span>
    </DialogPrimitive.Close>
  );
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "fixed inset-0 z-50 bg-black/80", // Darken without blur
        className
      )}
      {...props}
    />
  )
}


interface DialogContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  children: React.ReactNode
  header?: React.ReactNode
}

function DialogContent({
  className,
  children,
  header,
  ...props
}: DialogContentProps) {
  const useDefaultWidths = !hasWidthOrMaxWidth(className)

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          useDefaultWidths && "w-full max-w-[calc(100%-2rem)] sm:max-w-lg",
          "fixed top-1/2 left-1/2 z-50 translate-x-[-50%] translate-y-[-50%] rounded-none border bg-background shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          className
        )}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        {...props}
      >
          <VisuallyHidden>
          <DialogTitle>Dialog</DialogTitle>
        </VisuallyHidden>

        <div className="relative flex flex-col max-h-[90vh] overflow-hidden">
          {/* Fixed Header */}
          {header && (
            <div className="sticky top-0 z-10 bg-background border-b px-6 pt-6 pb-4">
              {header}
            </div>
          )}

          {/* Scrollable Content Area */}
          <div className="overflow-y-auto px-6 pb-6">
            {children}
          </div>
        </div>

        {/* Close Button */}
        <DialogPrimitive.Close className="absolute top-4 z-20 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer">
          <XIcon className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}


function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function DialogFixedHeader({
  title,
  description,
  action,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-2 ">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}


export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogFixedHeader,
}
