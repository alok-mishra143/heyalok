import { ExternalLink } from "lucide-react"

export function ExternalArrow() {
  return (
    <ExternalLink
      size={12}
      className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
      aria-hidden
    />
  )
}
