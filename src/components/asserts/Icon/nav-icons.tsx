import type { LucideIcon } from "lucide-react"

export function NavIcon({ icon: Icon, size = 16 }: { icon: LucideIcon; size?: number }) {
  return <Icon size={size} />
}
