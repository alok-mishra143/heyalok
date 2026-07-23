"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "motion/react"
import PixelateSvgFilter from "@/components/asserts/pixelate-svg-filter"
import { HoverTracker } from "@/components/ui/hover-tracker"
import { useSoundEffect } from "@/hooks/useSoundEffect"


interface Heading {
  id: string
  text: string
  level: number
}

export function BlogReadingProgress() {
  const { scrollYProgress } = useScroll()
  const {play}=useSoundEffect("windhit")

  const [headings, setHeadings] = useState<Heading[]>([])
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    const isSafari =
      typeof navigator !== "undefined" &&
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    setShowFilter(!isSafari)
  }, [])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const article = document.querySelector(".medium-content")
    if (!article) return

    const elements = article.querySelectorAll("h1, h2, h3, h4")
    const extracted: Heading[] = []

    elements.forEach((el) => {
      const id = el.id
      if (!id) return
      extracted.push({
        id,
        text: el.textContent?.trim() || "",
        level: parseInt(el.tagName[1]),
      })
    })

    setHeadings(extracted)

    if (extracted.length > 0) {
      setActiveId(extracted[0].id)
    }
  }, [])
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setProgress(Math.round(v * 100))
  })

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null

        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          if (
            !bestEntry ||
            entry.boundingClientRect.top < bestEntry.boundingClientRect.top
          ) {
            bestEntry = entry
          }
        }

        if (bestEntry) {
          setActiveId(bestEntry.target.id)
        } else {
          const sorted = [...entries]
            .filter((e) => e.boundingClientRect.top < 0)
            .sort(
              (a, b) =>
                b.boundingClientRect.top - a.boundingClientRect.top,
            )
          if (sorted.length > 0) {
            setActiveId(sorted[0].target.id)
          }
        }
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: 0,
      },
    )

    const els: Element[] = []
    for (const h of headings) {
      const el = document.getElementById(h.id)
      if (el) {
        observer.observe(el)
        els.push(el)
      }
    }

    return () => {
      for (const el of els) observer.unobserve(el)
    }
  }, [headings])

  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return
    const buttons = panel.querySelectorAll("button")
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return }
      if (e.key !== "Tab" || buttons.length === 0) return
      if (e.shiftKey && document.activeElement === buttons[0]) { e.preventDefault(); buttons[buttons.length - 1].focus() }
      else if (!e.shiftKey && document.activeElement === buttons[buttons.length - 1]) { e.preventDefault(); buttons[0].focus() }
    }
    buttons[0]?.focus()
    panel.addEventListener("keydown", onKeyDown)
    return () => panel.removeEventListener("keydown", onKeyDown)
  }, [open])

  const activeHeading = headings.find((h) => h.id === activeId)

  if (headings.length === 0) return null

  const overlayProps = { style: { filter: "url(#blog-toc-overlay)" } } as const

  return (
    <>
      {showFilter && <PixelateSvgFilter id="blog-toc-overlay" size={5} />}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            {...overlayProps}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
      <motion.div layout className="rounded-lg border border-border bg-background shadow-sm">
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="toc"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <nav ref={panelRef} className="flex max-h-140 overflow-y-auto flex-col gap-2 border-b border-border p-1 w-[clamp(11rem,80vw,26rem)] scroll-fade overscroll-contain" style={{ scrollbarGutter: "stable" }}>
                <HoverTracker defaultActiveSelector="[data-active-heading]" defaultActiveKey={activeId}>
                  {headings.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      data-hover="card-element"
                      {...(h.id === activeId ? { "data-active-heading": true } : {})}
                      onClick={() => {
                        setOpen(false)
                        setTimeout(
                          () =>
                            document
                              .getElementById(h.id)
                              ?.scrollIntoView({ behavior: "smooth" }),
                          50,
                        )
                      }}
                      className={`w-full rounded-sm p-5 flex items-center text-left text-sm transition-colors hover:text-foreground focus-visible:outline-dotted focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-muted-foreground ${
                        h.id === activeId
                          ? "border border-dotted text-foreground font-medium"
                          : "text-muted-foreground border border-transparent"
                      }`}
                    >
                      <span className="truncate min-w-0">{h.text}</span>
                    </button>
                  ))}
                </HoverTracker>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

          <div className="mx-auto w-[clamp(10rem,80vw,25rem)] px-4">
          <button
            type="button"
              onClick={() => {
              if(open==false) play({vol:0.007})
              setOpen(!open)
            }}
            className="flex h-12 w-full items-center justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-none"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={activeHeading?.id ?? "empty"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="truncate rounded  px-2 py-1 text-xs text-muted-foreground"
              >
                {activeHeading?.text ?? "\u00A0"}
              </motion.span>
            </AnimatePresence>

            <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
              <svg className="size-5 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={5}
                  className="opacity-20"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray={97.39}
                  strokeDashoffset={97.39 - (97.39 * progress) / 100}
                  style={{ transition: "stroke-dashoffset 0.15s ease" }}
                />
              </svg>
              <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={12} />
              </motion.div>
            </span>
          </button>
        </div>
        </motion.div>
      </motion.div>
    </>
  )
}
