"use client"

import { motion } from "motion/react"
import { useRef, useState, useCallback, useEffect } from "react"

interface BgStyle {
  top: number
  left: number
  width: number
  height: number
}

function getPosition(element: HTMLElement, container: HTMLElement): BgStyle {
  const rect = element.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  return {
    top: rect.top - containerRect.top,
    left: rect.left - containerRect.left,
    width: rect.width,
    height: rect.height,
  }
}

const spring = { type: "spring" as const, stiffness: 600, damping: 30, mass: 0.3 }

const mutedValue="bg-muted/50"

export function HoverTracker({
  children,
  className,
  defaultActiveSelector,
  defaultActiveKey,
  hoverAttr = "card-element",
}: {
  children: React.ReactNode
  className?: string
  defaultActiveSelector?: string
  defaultActiveKey?: string | null
  hoverAttr?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeElementRef = useRef<HTMLElement | null>(null)
  const defaultRef = useRef(defaultActiveSelector)
  defaultRef.current = defaultActiveSelector

  const [bgStyle, setBgStyle] = useState<BgStyle>({ top: 0, left: 0, width: 0, height: 0 })
  const [active, setActive] = useState(false)
  const [bgClass, setBgClass] = useState(mutedValue)

  function activate(element: HTMLElement) {
    if (element === activeElementRef.current) return
    activeElementRef.current = element
    const container = containerRef.current
    if (!container) return
    const el = element
    requestAnimationFrame(() => {
      setBgStyle(getPosition(el, container))
      setBgClass(el.getAttribute("data-hover-bg-class") || mutedValue)
      setActive(true)
    })
  }

  function snapToDefault() {
    activeElementRef.current = null
    const sel = defaultRef.current
    if (!sel) { setActive(false); return }
    const el = containerRef.current?.querySelector(sel) as HTMLElement | null
    if (el) activate(el)
    else setActive(false)
  }

  const cardSelector = `[data-hover="${hoverAttr}"]`

  useEffect(() => {
    if (!defaultActiveSelector) return
    const el = containerRef.current?.querySelector(defaultActiveSelector) as HTMLElement | null
    if (el) activate(el)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultActiveSelector, defaultActiveKey])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new MutationObserver(() => {
      const el = activeElementRef.current
      if (el && !container.contains(el)) {
        snapToDefault()
      }
    })
    observer.observe(container, { childList: true, subtree: true })
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMouseOver = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current
    if (!container) return
    const card = (e.target as HTMLElement).closest(cardSelector) as HTMLElement | null
    if (card && container.contains(card)) activate(card)
  }, [cardSelector])

  const handleFocus = useCallback((e: React.FocusEvent) => {
    const container = containerRef.current
    if (!container) return
    const card = (e.target as HTMLElement).closest(cardSelector) as HTMLElement | null
    if (card && container.contains(card)) activate(card)
  }, [cardSelector])

  return (
    <div
      ref={containerRef}
      className={`relative ${className ?? ""}`}
      onMouseOver={handleMouseOver}
      onMouseLeave={snapToDefault}
      onFocus={handleFocus}
      onBlur={snapToDefault}
    >
      <motion.div
        className={`pointer-events-none absolute  rounded-md ${bgClass}`}
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={
          active
            ? { opacity: 1, filter: "blur(0px)", ...bgStyle }
            : { opacity: 0, filter: "blur(8px)" }
        }
        transition={{
          top: spring,
          left: spring,
          width: spring,
          height: spring,
          opacity: { duration: 0.3, ease: "easeOut" },
          filter: { duration: 0.3, ease: "easeOut" },
        }}
      />
      <div className="relative z-0">{children}</div>
    </div>
  )
}
