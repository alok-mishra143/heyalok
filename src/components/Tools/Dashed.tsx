import { Cross } from "./Cross"

const dashH =
  "repeating-linear-gradient(90deg,var(--color-border) 0px,var(--color-border) 7px,transparent 7px,transparent 13px)"
const dashV =
  "repeating-linear-gradient(0deg,var(--color-border) 0px,var(--color-border) 7px,transparent 7px,transparent 13px)"

function DashedH() {
  return <div className="h-px w-full" style={{ backgroundImage: dashH }} />
}

function DashedV() {
  return <div className="hidden w-px shrink-0 self-stretch sm:block" style={{ backgroundImage: dashV }} />
}

export function RowDivider({ withCross }: { withCross?: boolean }) {
  return (
    <div className="relative">
      <DashedH />
      {withCross && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:block">
          <Cross />
        </div>
      )}
    </div>
  )
}

export { DashedH, DashedV }
