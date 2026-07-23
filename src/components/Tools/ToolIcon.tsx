import type { ToolIcon as ToolIconType } from "@/data/tools"
import Image from "next/image";

export function ToolIcon({ icon, name, showIcon }: { icon?: ToolIconType; name: string; showIcon?: boolean }) {
  if (!icon) {
    if (!showIcon) return null
    return (
      <span className="flex size-5 shrink-0 items-center justify-center text-[9px] font-bold text-muted-foreground opacity-80 transition-all group-hover:opacity-100">
        #
      </span>
    )
  }

  if (typeof icon === "string") {
    return (
      <Image
        src={icon}
        alt={name}
        width={20}
        height={20}
        className="size-5 shrink-0 rounded-sm opacity-80 transition-all group-hover:opacity-100"
        loading="lazy"
      />
    )
  }

  return (
    <>
      <img
        src={icon.light}
        alt={name}
        className="size-5 shrink-0 rounded-sm opacity-50 transition-all group-hover:opacity-100 block dark:hidden"
        loading="lazy"
      />
      <img
        src={icon.dark}
        alt={name}
        className="size-5 shrink-0 rounded-sm opacity-50 transition-all group-hover:opacity-100 hidden dark:block"
        loading="lazy"
      />
    </>
  )
}
