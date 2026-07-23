import { getTagHover, getTagBg } from "@/data/project-ui"
import { HoverTracker } from "@/components/ui/hover-tracker"

interface BlogTag {
  label: string
}

interface BlogTagsProps {
  tags: BlogTag[]
}

export function BlogTags({ tags }: BlogTagsProps) {
  if (!tags?.length) return null

  return (
    <HoverTracker hoverAttr="chip">
      <div className="flex flex-wrap gap-2 pt-1">
        {tags.map((tag) => (
          <span
            key={tag.label}
            data-hover="chip"
            data-hover-bg-class={getTagBg(tag.label)}
            className={` cursor-pointer rounded-md px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-all duration-300 ${getTagHover(tag.label)}`}
          >
            #{tag.label}
          </span>
        ))}
      </div>
    </HoverTracker>
  )
}
