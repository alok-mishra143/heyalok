import { cn } from "@/lib/utils"

type FadeDirection = "up" | "down" | "left" | "right"

type FadeProps = {
  className?: string
  direction: FadeDirection
}

const fadeDirections: Record<FadeDirection, string> = {
  up: "bg-gradient-to-t from-transparent to-background",
  down: "bg-gradient-to-b from-transparent to-background",
  left: "bg-gradient-to-l from-transparent to-background",
  right: "bg-gradient-to-r from-transparent to-background",
}

const Fade = ({ className, direction }: FadeProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none",
        fadeDirections[direction],
        className
      )}
    />
  )
}

export default Fade
