"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { navRoutes } from "@/data/data"
import { useExpandStore } from "@/store/expand-store"

const shortcutMap = navRoutes.reduce<
  Record<string, { href: string; target?: "_blank" | "_self" }>
>((map, route) => {
  if (route.shortCutKey) {
    map[route.shortCutKey] = { href: route.href, target: route.target }
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

      const route = shortcutMap[key]
      if (route) {
        e.preventDefault()
        if (route.target === "_blank") {
          window.open(route.href, "_blank", "noopener,noreferrer")
        } else {
          router.push(route.href)
        }
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
