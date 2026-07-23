"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { navRoutes } from "@/data/data"
import { useExpandStore } from "@/store/expand-store"

const shortcutMap = navRoutes.reduce<Record<string, string>>((map, route) => {
  if (route.shortCutKey) {
    map[route.shortCutKey] = route.href
  }
  return map
}, {})

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!target || !(target instanceof HTMLElement)) return false
  const tag = target.tagName.toLowerCase()
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    target.isContentEditable
  )
}

export function useKeyboardNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        e.shiftKey ||
        isEditableTarget(e.target)
      ) {
        return
      }

      const key = e.key.toLowerCase()

      const href = shortcutMap[key]
      if (href) {
        e.preventDefault()
        router.push(href)
        return
      }

      if (key === "p") {
        e.preventDefault()
        const { isExpanded, setIsExpanded } = useExpandStore.getState()
        if (pathname === "/") {
          setIsExpanded(!isExpanded)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router, pathname])
}
