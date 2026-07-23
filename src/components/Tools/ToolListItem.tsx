import type { ToolItem } from "@/data/tools"
import { ToolIcon } from "./ToolIcon"
import { ExternalArrow } from "./ExternalArrow"

export function ToolListItem({ item, showIcon }: { item: ToolItem; showIcon?: boolean }) {
  const hasValidHref = typeof item.href === "string" && item.href.length > 0
  const Tag = hasValidHref ? "a" : "span"
  const linkProps = hasValidHref
    ? { href: item.href!, target: "_blank" as const, rel: "noopener noreferrer" as const }
    : {}

  const ariaLabel = hasValidHref
    ? item.description
      ? `${item.name} — ${item.description}`
      : `${item.name} — ${item.href!.replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "")}`
    : undefined

  return (
    <li>
      <Tag
        {...linkProps}
        aria-label={ariaLabel}
        className="group flex items-center gap-3 rounded-xl px-1 py-2 transition-all"
      >
        <ToolIcon icon={item.icon} name={item.name} showIcon={showIcon} />
        <span>
          <span className="block text-sm font-medium leading-tight text-primary/90 transition-all duration-300 group-hover:text-primary group-hover:[text-shadow:0_0_.65px_currentColor]">{item.name}</span>
          <span className="mt-0.5 block text-xs leading-tight text-muted-foreground">
            {item.description}
          </span>
        </span>
        {hasValidHref && <ExternalArrow />}
      </Tag>
    </li>
  )
}
