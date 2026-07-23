"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { Search } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

import PixelateSvgFilter from "../asserts/pixelate-svg-filter"

import Navigation from "./Navigation"
import { useSoundEffect } from "@/hooks/useSoundEffect"
import AskAi from "./AskAI"
import { useDialogStore } from "@/store/dialog-store"
import ShortCuts from "./ShortCuts"
import { HoverTracker } from "../ui/hover-tracker"
import BlogSearch from "./BlogSearch"

const CustomDialog = () => {
  const { play } = useSoundEffect("pop")

  // const overlayProps = { style: { filter: "url(#dialog-overlay)" } } as const
  const [open, setOpen] = useState(false)
  const [searchQueryDirty, setSearchQueryDirty] = useState(false)
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    const isSafari =
      typeof navigator !== "undefined" &&
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    const isMobile =
      typeof navigator !== "undefined" &&
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    setShowFilter(!isSafari && !isMobile)
  }, [])
  const { searchQuery, setSearchQuery } = useDialogStore()
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        if (!open) setOpen(true)
        else setOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (open) play()
  }, [open, play])

  const itemsContainerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return
    e.preventDefault()

    const container = itemsContainerRef.current
    if (!container) return

    const items = container.querySelectorAll<HTMLElement>("button, a[href]")
    if (items.length === 0) return

    const currentIndex = Array.from(items).findIndex(
      (el) => el === document.activeElement
    )

    let nextIndex: number
    if (e.key === "ArrowDown") {
      nextIndex = currentIndex + 1
      if (nextIndex >= items.length) nextIndex = 0
    } else {
      nextIndex = currentIndex - 1
      if (nextIndex < 0) nextIndex = items.length - 1
    }

    items[nextIndex]?.focus()
  }, [])

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      const container = itemsContainerRef.current
      if (!container) return
      const firstItem = container.querySelector<HTMLElement>("button, a[href]")
      firstItem?.focus()
    }
  }, [])

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (!val) {
          setTimeout(() => setSearchQuery(""), 150)
          setTimeout(() => setSearchQueryDirty(false), 150)
        }
      }}
    >
      {showFilter && <PixelateSvgFilter size={8} />}
      <DialogTrigger aria-label="Search">
        <div className="inline-flex w-fit items-center rounded-md border p-1 text-[10px] text-muted-foreground transition-all duration-500 hover:bg-muted/50">
          <Search size={13} />

          <span className="flex items-center gap-1 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out max-md:max-w-0 max-md:opacity-0 max-md:blur-sm md:ml-1 md:max-w-24 md:opacity-100 md:blur-none">
            <kbd className="rounded border bg-muted px-1 py-[1px] font-mono text-[10px] leading-none">
              ⌘
            </kbd>

            <span className="text-[8px]">+</span>

            <kbd className="rounded border bg-muted px-1 py-[1px] font-mono text-[10px] leading-none uppercase">
              K
            </kbd>
          </span>
        </div>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className={`m-0 w-full overflow-hidden rounded-sm p-0 ${
          searchQueryDirty ? "h-[70dvh] sm:max-w-2xl" : "h-110"
        }`}
      >
        <div className="relative flex h-full w-full flex-col overflow-hidden">
          <div className="flex items-center gap-1 border-b pl-2">
            <Search size={11} />
            <input
              type="text"
              className="w-full p-2 focus-visible:outline-none"
              placeholder="Search in Blogs and Lists..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setSearchQueryDirty(true)
              }}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
          <div
            ref={itemsContainerRef}
            className="flex flex-1 scroll-fade flex-col gap-1 overflow-x-hidden overflow-y-scroll p-2"
            onKeyDown={handleKeyDown}
          >
            <HoverTracker>
              <BlogSearch onNavigate={() => setOpen(false)} />
              <AskAi onNavigate={() => setOpen(false)} />
              <Navigation onNavigate={() => setOpen(false)} />
              <ShortCuts onNavigate={() => setOpen(false)} />
            </HoverTracker>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CustomDialog
