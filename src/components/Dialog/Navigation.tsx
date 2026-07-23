"use client"

import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { navRoutes } from "@/data/data"
import { useDialogStore } from "@/store/dialog-store"
import ItemElement from "./ItemElement"

type NavigationProps = {
  onNavigate?: () => void
}

const Navigation = ({ onNavigate }: NavigationProps) => {
  const searchQuery = useDialogStore((s) => s.searchQuery)

  const sectionTitle = "Navigation"
  const sectionMatch =
    !searchQuery ||
    sectionTitle.toLowerCase().includes(searchQuery.toLowerCase())

  const filteredRoutes = sectionMatch
    ? navRoutes
    : navRoutes.filter(
        (route) =>
          route.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          route.subTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )

  if (filteredRoutes.length === 0) return null

  return (
    <nav aria-label="Dialog navigation" className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle className="font-pixel text-sm leading-none font-extrabold text-primary">
          {sectionTitle}
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col">
        {filteredRoutes.map((route) => (
          <ItemElement
            key={route.href}
            icon={route.icon}
            label={route.label}
            subTitle={route.subTitle}
            shortcutKey={route.shortCutKey}
            href={route.href}
            onClick={onNavigate}
          />
        ))}
      </div>
    </nav>
  )
}

export default Navigation
