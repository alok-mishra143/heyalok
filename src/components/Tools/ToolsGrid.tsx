"use client"

import { toolCategories } from "@/data/tools"
import { OuterFrame } from "./OuterFrame"
import { RowDivider, DashedV } from "./Dashed"
import { CategoryCard } from "./CategoryCard"

export function ToolsGrid() {
  const rows: React.ReactElement[] = []
  let globalIndex = 0

  for (let i = 0; i < toolCategories.length; i++) {
    const category = toolCategories[i]
    const catIndex = globalIndex++

    if (category.span === "full") {
      if (i > 0) rows.push(<RowDivider key={`d${i}`} />)
      rows.push(<CategoryCard key={category.name} category={category} index={catIndex} />)
      continue
    }

    rows.push(<RowDivider key={`d${i}`} withCross />)

    const first = toolCategories[i]
    const second = toolCategories[i + 1]

    if (second?.span === "half") {
      rows.push(
        <div key={`row${i}`} className="flex flex-col sm:flex-row">
          <div className="flex-1">
            <CategoryCard category={first} index={globalIndex++} />
          </div>
          <DashedV />
          <div className="flex-1">
            <CategoryCard category={second} index={globalIndex++} />
          </div>
        </div>
      )
      i++
    } else {
      rows.push(<CategoryCard key={category.name} category={first} index={catIndex} />)
    }
  }

  return (
    <OuterFrame>
      <div className="mt-6 flex flex-col gap-0">{rows}</div>
    </OuterFrame>
  )
}
