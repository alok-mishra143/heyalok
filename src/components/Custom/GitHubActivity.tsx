"use client"

/* eslint-disable react-hooks/refs */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion } from "motion/react"

// ── Real GitHub contributions data ────────────────────────────────────────
interface Contribution {
  date: string
  count: number
  level: number
}

export interface GithubData {
  total: Record<string, number>
  contributions: Array<Contribution>
}

const DEFAULT_DATA: GithubData = {
  total: {},
  contributions: [],
}

const MONTHS = [
  " Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

// ── Color scale (adapted to blend well with the theme) ───────────────────
const LEVELS = [
  "bg-muted border-border/40", // 0
  "bg-foreground/20 border-transparent", // 1
  "bg-foreground/40 border-transparent", // 2
  "bg-foreground/70 border-transparent", // 3
  "bg-foreground border-transparent", // 4
]

const MIN_CELL = 7
const GAP = 2
const DOW_LABEL_WIDTH = 18
const DOW_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""]

// ── Build week columns for a full year ────────────────────────────────────
interface DayCell {
  date: string
  level: number
  count: number
  dow: number
}

// Pre-computed static geometry of the year grid. Runs once per year (per
// module) — avoids recomputing week layout on every render.
function buildWeeks(
  contributions: Array<Contribution>,
  year: number
): Array<Array<DayCell | null>> {
  // Index contributions by date for O(1) lookup.
  const map = new Map<string, Contribution>()
  for (const c of contributions) map.set(c.date, c)

  const jan1 = new Date(year, 0, 1)
  const startOffset = (jan1.getDay() + 6) % 7 // 0 = Mon

  const cells: Array<DayCell | null> = []
  for (let i = 0; i < startOffset; i++) cells.push(null)

  const d = new Date(jan1)
  while (d.getFullYear() === year) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    const entry = map.get(key)
    cells.push({
      date: key,
      level: entry ? entry.level : 0,
      count: entry ? entry.count : 0,
      dow: (d.getDay() + 6) % 7,
    })
    d.setDate(d.getDate() + 1)
  }

  const weeks: Array<Array<DayCell | null>> = []
  for (let i = 0; i < cells.length; i += 7) {
    // Always keep 7 slots per week — nulls for leading padding at year start.
    // Using indexed access in render means no more .find() calls.
    const week: Array<DayCell | null> = [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]
    for (let j = 0; j < 7 && i + j < cells.length; j++) {
      const c = cells[i + j]
      if (c) week[c.dow] = c
    }
    weeks.push(week)
  }
  return weeks
}

// ── Month label positions ──────────────────────────────────────────────────
function getMonthLabels(
  weeks: Array<Array<DayCell | null>>
): Array<{ label: string; col: number }> {
  const seen = new Set<string>()
  const labels: Array<{ label: string; col: number }> = []
  for (let col = 0; col < weeks.length; col++) {
    const week = weeks[col]
    const first = week.find(Boolean)
    if (!first) continue
    const month = first.date.slice(0, 7)
    if (!seen.has(month)) {
      seen.add(month)
      labels.push({
        label: MONTHS[Number(month.slice(5)) - 1],
        col,
      })
    }
  }
  return labels
}

// ── Tooltip ────────────────────────────────────────────────────────────────
interface TooltipData {
  date: string
  count: number
  x: number
  y: number
}

const Tooltip = memo(({ data }: { data: TooltipData | null }) => {
  const lastDataRef = useRef<TooltipData | null>(null)
  if (data) lastDataRef.current = data

  const current = data ?? lastDataRef.current

  const formatted = useMemo(() => {
    if (!current) return ""
    const d = new Date(current.date + "T00:00:00")
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }, [current])

  const label = !current
    ? ""
    : current.count === 0
      ? "No contributions"
      : `${current.count} contribution${current.count > 1 ? "s" : ""}`

  if (!current) return null

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: data ? 1 : 0,
        scale: data ? 1 : 0.98,
        left: current.x,
        top: current.y - 44,
      }}
      style={{ x: "-50%" }}
      transition={{
        left: { type: "spring", stiffness: 280, damping: 28, mass: 0.9 },
        top: { type: "spring", stiffness: 280, damping: 28, mass: 0.9 },
        opacity: { duration: 0.18, ease: "easeOut" },
        scale: { duration: 0.18, ease: "easeOut" },
      }}
      className="pointer-events-none fixed top-0 left-0 z-50 flex w-max origin-bottom justify-center"
    >
      <div className="flex items-center gap-1.5 overflow-hidden rounded-md border border-border/40 bg-popover px-3 py-1.5 text-[11px] leading-snug whitespace-nowrap text-popover-foreground shadow-xl">
        <span className="font-semibold text-foreground">{label}</span>
        <span className="text-muted-foreground opacity-30">·</span>
        <span className="text-muted-foreground">{formatted}</span>
      </div>
    </motion.div>
  )
})
Tooltip.displayName = "Tooltip"

// ── Grid ──────────────────────────────────────────────────────────────────
// Memoized so hover-driven state updates in the parent don't re-render
// all ~370 cells. Uses a single event-delegation handler instead of one
// listener per cell.
interface GridProps {
  weeks: Array<Array<DayCell | null>>
  monthLabels: Array<{ label: string; col: number }>
  cellSize: number
  onShow: (d: TooltipData) => void
  onHide: () => void
}

const Grid = memo(
  ({ weeks, monthLabels, cellSize, onShow, onHide }: GridProps) => {
    const labelFontSize = Math.max(8, Math.min(10, cellSize * 0.9))
    const monthLabelHeight = Math.max(14, cellSize + 6)
    const dowPaddingTop = monthLabelHeight + 2

    const handleOver = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>(
          "[data-date]"
        )
        if (!target) return
        const date = target.dataset.date!
        const count = Number(target.dataset.count)
        const r = target.getBoundingClientRect()
        onShow({
          date,
          count,
          x: r.left + r.width / 2,
          y: r.top,
        })
      },
      [onShow]
    )

    return (
      <div
        style={{ display: "flex", gap: GAP, minWidth: "max-content" }}
        onMouseOver={handleOver}
        onMouseLeave={onHide}
      >
        {/* DOW labels */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: GAP,
            paddingTop: dowPaddingTop,
          }}
        >
          {DOW_LABELS.map((label, i) => (
            <div
              key={i}
              style={{
                height: cellSize,
                lineHeight: `${cellSize}px`,
                fontSize: labelFontSize,
                width: DOW_LABEL_WIDTH,
                textAlign: "right",
                paddingRight: 4,
              }}
              className="text-muted-foreground"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Weeks */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Month labels */}
          <div
            style={{
              display: "flex",
              gap: GAP,
              height: monthLabelHeight,
              marginBottom: 2,
            }}
          >
            {weeks.map((_, wi) => {
              const ml = monthLabels.find((m) => m.col === wi)
              return (
                <div
                  key={wi}
                  style={{
                    width: cellSize,
                    fontSize: labelFontSize,
                    userSelect: "none",
                  }}
                  className="text-muted-foreground"
                >
                  {ml?.label ?? ""}
                </div>
              )
            })}
          </div>

          {/* Cells */}
          <div style={{ display: "flex", gap: GAP }}>
            {weeks.map((week, wi) => (
              <div
                key={wi}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: GAP,
                }}
              >
                {week.map((cell, dow) =>
                  cell ? (
                    <div
                      key={dow}
                      data-date={cell.date}
                      data-count={cell.count}
                      className={`relative cursor-pointer border transition-transform duration-100 hover:z-10 hover:scale-150 ${LEVELS[cell.level]}`}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        borderRadius: 2,
                      }}
                    />
                  ) : (
                    <div
                      key={dow}
                      style={{ width: cellSize, height: cellSize }}
                    />
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
)
Grid.displayName = "Grid"

// ── Main Component ─────────────────────────────────────────────────────────
interface GitHubActivityProps {
  data?: GithubData
}

const GitHubActivity = ({ data = DEFAULT_DATA }: GitHubActivityProps) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const [cellSize, setCellSize] = useState(MIN_CELL)
  const [isMeasured, setIsMeasured] = useState(false)
  const chartRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const hideTimeoutRef = useRef<number | null>(null)

  const dataYear = useMemo(
    () => Number(Object.keys(data.total)[0]) || new Date().getFullYear(),
    [data]
  )
  const totalActivities = data.total[String(dataYear)] ?? 0
  const weeks = useMemo(
    () => buildWeeks(data.contributions, dataYear),
    [data, dataYear]
  )
  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    let frame: number | null = null

    const measure = () => {
      const styles = window.getComputedStyle(chart)
      const horizontalPadding =
        Number.parseFloat(styles.paddingLeft) +
        Number.parseFloat(styles.paddingRight)
      const contentWidth = chart.clientWidth - horizontalPadding
      const nextCellSize =
        (contentWidth - DOW_LABEL_WIDTH - weeks.length * GAP) / weeks.length
      const next = Math.max(MIN_CELL, nextCellSize)

      setCellSize((current) =>
        Math.abs(current - next) < 0.1 ? current : Number(next.toFixed(2))
      )
      setIsMeasured(true)
    }

    const scheduleMeasure = () => {
      if (frame !== null) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        frame = null
        measure()
      })
    }

    scheduleMeasure()

    const observer = new ResizeObserver(scheduleMeasure)
    observer.observe(chart)

    return () => {
      if (frame !== null) cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [weeks.length])

  // rAF-coalesced tooltip updates — avoids multiple renders per mouse move
  // when dragging across cells quickly.
  const handleShow = useCallback((d: TooltipData) => {
    if (hideTimeoutRef.current !== null) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      setTooltip(d)
    })
  }, [])

  const handleHide = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    if (hideTimeoutRef.current !== null) clearTimeout(hideTimeoutRef.current)
    hideTimeoutRef.current = window.setTimeout(() => {
      setTooltip(null)
      hideTimeoutRef.current = null
    }, 90)
  }, [])

  return (
    <div
      className="relative block w-full min-w-xl border-b border-border/40 font-mono"
      style={{ background: "transparent" }}
    >
      <div
        ref={chartRef}
        className="relative min-h-35 w-full px-4 pt-5 pb-5 select-none sm:px-6"
      >
        <motion.div
          initial={false}
          animate={{
            opacity: isMeasured ? 1 : 0,
            filter: isMeasured ? "blur(0px)" : "blur(10px)",
            y: isMeasured ? 0 : 4,
            scale: isMeasured ? 1 : 0.995,
          }}
          transition={{
            opacity: { duration: 0.28, ease: "easeOut" },
            filter: { duration: 0.42, ease: "easeOut" },
            y: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
          }}
          className={isMeasured ? undefined : "pointer-events-none"}
          aria-hidden={!isMeasured}
        >
          <Grid
            weeks={weeks}
            monthLabels={monthLabels}
            cellSize={cellSize}
            onShow={handleShow}
            onHide={handleHide}
          />

          {/* ── Footer ── */}
          <div className="mt-4 flex items-center justify-between gap-6 font-mono text-[10px] tracking-wider text-muted-foreground">
            <span>
              {totalActivities.toLocaleString()} contributions in {dataYear}
            </span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              {LEVELS.map((lvClass, i) => (
                <div
                  key={i}
                  className={`border ${lvClass}`}
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: 2,
                  }}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </motion.div>
      </div>

      <Tooltip data={tooltip} />
    </div>
  )
}

export default GitHubActivity
