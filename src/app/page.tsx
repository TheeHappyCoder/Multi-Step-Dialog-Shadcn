"use client"

import * as React from "react"
import StandardPage from "./standard/page"
import DynamicPage from "./dynamic/page"
import ValidationPage from "./validation/page"

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-5xl space-y-16">
        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Multi-Step Dialogs</h1>
          <p className="text-base text-muted-foreground">
            Three clean examples — Standard, Dynamic, and Validation.
          </p>
        </header>

        {/* Button Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* --- Standard --- */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-lg font-semibold mb-2">Standard</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-[260px]">
              A simple, fixed multi-step flow for quick setups.
            </p>
            <div className="flex justify-center">
              <StandardPage />
            </div>
          </div>

          {/* --- Dynamic --- */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-lg font-semibold mb-2">Dynamic</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-[260px]">
              Steps that adapt based on user input and context.
            </p>
            <div className="flex justify-center">
              <DynamicPage />
            </div>
          </div>

          {/* --- Validation --- */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-lg font-semibold mb-2">Validation</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-[260px]">
              Prevents navigation until all required fields are valid.
            </p>
            <div className="flex justify-center">
              <ValidationPage />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
