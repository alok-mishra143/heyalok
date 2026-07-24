"use client"

import Link from "next/link"
import type { ReactNode, MouseEvent } from "react"
import { Sun, Maximize } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const STRING_ICONS: Record<string, LucideIcon> = {
  Sun,
  Expand: Maximize,
}

function DialogIcon({ icon }: { icon: string | LucideIcon }) {
  if (typeof icon !== "string") {
    const Icon = icon
    return <Icon size={18} className="shrink-0" />
  }
  const Icon = STRING_ICONS[icon]
  if (!Icon) return null
  return <Icon size={18} className="shrink-0" />
}

type ItemElementProps = {
  icon?: string | LucideIcon
  iconSlot?: ReactNode
  label: string
  subTitle?: string
  shortcutKey?: string
  href?: string
  target?: string
  onClick?: (e: MouseEvent) => void
  className?: string
}

const itemClass =
  "group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors  focus-visible:bg-transparent focus-visible:outline-1 focus-visible:outline-dashed focus-visible:outline-foreground/20 focus-visible:outline-offset-1"

const ItemElement = ({
  icon,
  iconSlot,
  label,
  subTitle,
  shortcutKey,
  href,
  target,
  onClick,
  className,
}: ItemElementProps) => {
  const content = (
    <>
      {iconSlot ? iconSlot : icon ? <DialogIcon icon={icon} /> : null}

      <span className="min-w-0 flex-1">
        <span className="block text-sm leading-none font-medium">{label}</span>
        {subTitle && (
          <span className="mt-1 block text-xs leading-snug text-muted-foreground">
            {subTitle}
          </span>
        )}
      </span>

      {shortcutKey && (
        <kbd className="flex min-w-6 items-center justify-center rounded-sm border border-border bg-muted px-1.5 py-1 font-mono text-[10px] leading-none text-muted-foreground uppercase shadow-sm">
          {shortcutKey}
        </kbd>
      )}
    </>
  )

  if (href) {
    return (
      <Link
        data-hover="card-element"
        href={href}
        target={target}
        rel={target === "_blank" ? "noreferrer" : undefined}
        onClick={onClick}
        className={cn(itemClass, className)}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      data-hover="card-element"
      onClick={onClick}
      className={cn(itemClass, className)}
    >
      {content}
    </button>
  )
}

export default ItemElement
