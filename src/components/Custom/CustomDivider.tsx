import { cn } from "@/lib/utils"

type Variant =
  | "line-315"
  | "line-180"
  | "line-90"
  | "grid"
  | "dotted"
  | "square"
type Orientation = "horizontal" | "vertical"
type BorderMode = "both" | "top" | "bottom" | "hide"

interface DividerProps {
  variant?: Variant
  orientation?: Orientation
  border?: BorderMode
  className?: string
}

const angleMap: Record<"line-315" | "line-180" | "line-90", string> = {
  "line-315": "315deg",
  "line-180": "180deg",
  "line-90": "90deg",
}

const variantStyleMap: Record<Variant, React.CSSProperties> = {
  "line-315": {
    backgroundImage: `repeating-linear-gradient(
      ${angleMap["line-315"]},
      currentColor 0px,
      currentColor 1px,
      transparent 1px,
      transparent 5px
    )`,
  },
  "line-180": {
    backgroundImage: `repeating-linear-gradient(
      ${angleMap["line-180"]},
      currentColor 0px,
      currentColor 1px,
      transparent 1px,
      transparent 5px
    )`,
  },
  "line-90": {
    backgroundImage: `repeating-linear-gradient(
      ${angleMap["line-90"]},
      currentColor 0px,
      currentColor 1px,
      transparent 1px,
      transparent 5px
    )`,
  },
  grid: {
    backgroundImage:
      "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
    backgroundSize: "8px 8px",
  },
  dotted: {
    backgroundImage:
      "radial-gradient(circle, currentColor 1.2px, transparent 1.2px)",
    backgroundSize: "8px 8px",
  },
  square: {
    backgroundImage:
      "repeating-conic-gradient(currentColor 0% 25%, transparent 0% 50%)",
    backgroundSize: "8px 8px",
  },
}

export function Divider({
  variant = "line-315",
  orientation = "horizontal",
  border = "both",
  className,
}: DividerProps) {
  const isHorizontal = orientation === "horizontal"
  const showLeadingBorder = border === "both" || border === "top"
  const showTrailingBorder = border === "both" || border === "bottom"

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-stretch self-stretch",
        isHorizontal ? "w-full flex-col" : "flex-row",
        className
      )}
    >
      {/* Leading border */}
      {showLeadingBorder ? (
        <div
          className={cn(
            "shrink-0 bg-border",
            isHorizontal ? "h-px w-full self-start" : "h-full w-px self-start"
          )}
        />
      ) : null}

      {/* Hatched pattern — clipped strictly between the two border lines */}
      <div
        className={cn(
          "shrink-0 overflow-hidden",
          isHorizontal ? "min-h-0 w-full flex-1" : "h-full min-w-0 flex-1"
        )}
        aria-hidden
      >
        <div
          className="h-full w-full text-border"
          style={{
            ...variantStyleMap[variant],
            opacity: 0.45,
          }}
        />
      </div>

      {/* Trailing border */}
      {showTrailingBorder ? (
        <div
          className={cn(
            "shrink-0 bg-border",
            isHorizontal ? "h-px w-full self-end" : "h-full w-px self-end"
          )}
        />
      ) : null}
    </div>
  )
}
