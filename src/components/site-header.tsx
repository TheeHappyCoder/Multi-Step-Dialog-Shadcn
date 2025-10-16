'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import { Moon, Sun } from 'lucide-react'
import clsx from 'clsx'

export function SiteHeader() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const navLinks = [
    { title: 'Standard', href: '/' }, // now root route
    { title: 'Validation', href: '/validation' },
    { title: 'Dynamic', href: '/dynamic' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-screen-xl mx-auto">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <span className="text-xl font-bold tracking-tight">
            Multi-Step Dialog Template
          </span>
        </div>


        {/* Right side - Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
