"use client"

import React, { useEffect, useSyncExternalStore } from "react"
import { Eclipse } from "lucide-react"
import { cn } from "@/lib/utils"
import { useThemeToggle } from "@/hooks/useThemeToggle"

type Direction = "center" | "left" | "right" | "top" | "bottom"

interface ThemeSwitcherProps {
  direction?: Direction
  duration?: number
  className?: string
  disableAnimation?: boolean
}

function subscribeToHydration() {
  return () => {}
}

function getClientHydrationSnapshot() {
  return true
}

function getServerHydrationSnapshot() {
  return false
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  direction = "center",
  duration = 380,
  className,
  disableAnimation = false,
}) => {
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  )

  const { toggleTheme, isDark } = useThemeToggle({
    direction,
    duration,
    disableAnimation,
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey) return

      const target = event.target as HTMLElement | null
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable

      if (isTyping) return

      if (event.key.toLowerCase() === "d") {
        toggleTheme()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleTheme])

  const label = mounted
    ? isDark
      ? "Activate light theme"
      : "Activate dark theme"
    : "Toggle theme"

  return (
    <button
      type="button"
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-current",
        className
      )}
      onClick={(event) => toggleTheme(event.clientX, event.clientY)}
      aria-label={label}
    >
      <Eclipse size={16} className="rotate-90" />
    </button>
  )
}

export default ThemeSwitcher
