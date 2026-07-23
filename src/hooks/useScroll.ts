"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const recalcMaxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight

    let maxScroll = recalcMaxScroll()

    const update = () => {
      const scrollTop = window.scrollY
      const value = maxScroll <= 0 ? 1 : scrollTop / maxScroll
      setProgress(Math.min(1, Math.max(0, value)))
    }

    const recalcAndUpdate = () => {
      maxScroll = recalcMaxScroll()
      update()
    }

    update()

    const resizeObserver = new ResizeObserver(recalcAndUpdate)
    resizeObserver.observe(document.body)

    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", recalcAndUpdate, { passive: true })

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", recalcAndUpdate)
    }
  }, [pathname])

  return progress
}
