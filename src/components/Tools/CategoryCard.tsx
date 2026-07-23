import type { ToolCategory } from "@/data/tools"
import { AnimatedCard } from "./AnimatedCard"
import { ToolListItem } from "./ToolListItem"

export function CategoryCard({ category, index }: { category: ToolCategory; index: number }) {
  const isCompact = category.items.every((item) => !item.description)

  return (
    <AnimatedCard index={index}>
      <div className="p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            {category.name}
          </span>
        </div>

        {isCompact ? (
          <ul className="flex flex-wrap gap-2">
            {category.items.map((item) => (
              <ToolListItem key={item.name} item={item} />
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {category.items.map((item) => (
              <ToolListItem key={item.name} item={item} />
            ))}
          </ul>
        )}
      </div>
    </AnimatedCard>
  )
}
