"use client"

import { useCallback, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { useSoundEffect } from "@/hooks/useSoundEffect"

type Direction = "center" | "left" | "right" | "top" | "bottom"

const CLIP_START: Record<Direction, string> = {
  center: "",
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
  top: "inset(100% 0 0 0)",
  bottom: "inset(0 0 100% 0)",
}

const EASE = "cubic-bezier(0.25, 1, 0.5, 1)"

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function releaseWillChange() {
  document.documentElement.style.willChange = ""
}

let injected = false

function ensureCSS() {
  if (injected || typeof document === "undefined") return
  injected = true
  const el = document.createElement("style")
  el.textContent = `
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
    }
  `
  document.head.appendChild(el)
}

export function useThemeToggle({
  direction = "center",
  duration = 380,
  disableAnimation = false,
}: {
  direction?: Direction
  duration?: number
  disableAnimation?: boolean
} = {}) {
  const locked = useRef(false)
  const { setTheme, resolvedTheme } = useTheme()
  const { play } = useSoundEffect("blob")

  useEffect(() => {
    ensureCSS()
  }, [])

  const isDark = resolvedTheme === "dark"

  const toggleTheme = useCallback(
    (x?: number, y?: number) => {
      if (locked.current) return
      locked.current = true

      play()

      const nextTheme = isDark ? "light" : "dark"

      const unlock = () => {
        releaseWillChange()
        locked.current = false
      }

      if (
        disableAnimation ||
        typeof document.startViewTransition !== "function" ||
        prefersReducedMotion()
      ) {
        setTheme(nextTheme)
        locked.current = false
        return
      }

      const clickX = x ?? window.innerWidth / 2
      const clickY = y ?? window.innerHeight / 2

      requestAnimationFrame(() => {
        document.documentElement.style.willChange = "clip-path"

        const transition = document.startViewTransition(() => {
          setTheme(nextTheme)
        })

        transition.ready
          .then(() => {
            let clipStart = CLIP_START[direction]
            let clipEnd = "inset(0 0 0 0)"

            if (direction === "center") {
              const radius = Math.hypot(
                Math.max(clickX, window.innerWidth - clickX),
                Math.max(clickY, window.innerHeight - clickY)
              )
              clipStart = `circle(0px at ${clickX}px ${clickY}px)`
              clipEnd = `circle(${radius}px at ${clickX}px ${clickY}px)`
            }

            const animation = document.documentElement.animate(
              [{ clipPath: clipStart }, { clipPath: clipEnd }],
              {
                duration,
                easing: EASE,
                pseudoElement: "::view-transition-new(root)",
              }
            )

            animation.finished.catch(() => {}).finally(unlock)
          })
          .catch(unlock)
      })
    },
    [isDark, setTheme, direction, duration, disableAnimation, play]
  )

  return { toggleTheme, isDark }
}
