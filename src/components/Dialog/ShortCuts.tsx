"use client"

import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useThemeToggle } from "@/hooks/useThemeToggle"
import { useDialogStore } from "@/store/dialog-store"
import { useExpandStore } from "@/store/expand-store"
import { useCallback, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { shortcuts, type ShortcutAction } from "@/data/data"
import ItemElement from "./ItemElement"

type ShortCutsProps = {
  onNavigate?: () => void
}

const ShortCuts = ({ onNavigate }: ShortCutsProps) => {
  const searchQuery = useDialogStore((s) => s.searchQuery)
  const { toggleTheme } = useThemeToggle()
  const pathname = usePathname()
  const router = useRouter()
  const [pendingAction, setPendingAction] = useState<ShortcutAction | null>(
    null
  )

  const sectionTitle = "ShortCuts"
  const sectionMatch =
    !searchQuery ||
    sectionTitle.toLowerCase().includes(searchQuery.toLowerCase())

  const filteredShortcuts = sectionMatch
    ? shortcuts
    : shortcuts.filter(
        (s) =>
          s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.subTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.shortcutKey.toLowerCase().includes(searchQuery.toLowerCase())
      )

  const handleToggleTheme = useCallback(
    (e: React.MouseEvent) => {
      toggleTheme(e.clientX, e.clientY)
      setTimeout(() => onNavigate?.(), 80)
    },
    [toggleTheme, onNavigate]
  )

  const handleExpandProfile = useCallback(() => {
    if (pathname === "/") {
      const { isExpanded, setIsExpanded } = useExpandStore.getState()
      setIsExpanded(!isExpanded)
      onNavigate?.()
    } else {
      setPendingAction("expandProfile")
    }
  }, [pathname, onNavigate])

  const confirmExpandProfile = useCallback(() => {
    setPendingAction(null)
    const { isExpanded, setIsExpanded } = useExpandStore.getState()
    setIsExpanded(!isExpanded)
    onNavigate?.()
    router.push("/")
  }, [router, onNavigate])

  if (pendingAction) {
    return (
      <nav aria-label="Dialog shortcuts" className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="font-pixel text-sm leading-none font-extrabold text-primary">
            {sectionTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 rounded-md border border-border p-4">
          <p className="text-sm font-medium">Navigate to home?</p>
          <p className="text-xs text-muted-foreground">
            You need to be on the home route to expand the profile image.
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={confirmExpandProfile}
              className="flex-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
            >
              Go to home
            </button>
            <button
              onClick={() => setPendingAction(null)}
              className="flex-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </nav>
    )
  }

  if (filteredShortcuts.length === 0) return null

  return (
    <nav aria-label="Dialog shortcuts" className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle className="font-pixel text-sm leading-none font-extrabold text-primary">
          {sectionTitle}
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col">
        {filteredShortcuts.map((shortcut) => (
          <ItemElement
            key={shortcut.label}
            icon={shortcut.icon}
            label={shortcut.label}
            subTitle={shortcut.subTitle}
            shortcutKey={shortcut.shortcutKey}
            onClick={
              shortcut.action === "toggleTheme"
                ? handleToggleTheme
                : shortcut.action === "expandProfile"
                  ? handleExpandProfile
                  : undefined
            }
          />
        ))}
      </div>
    </nav>
  )
}

export default ShortCuts
