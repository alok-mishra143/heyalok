# WaveForm Component — Line-by-Line Explanation

This component renders an animated bar graph that looks like a waveform. It's used to visualize dates — each bar's height represents proximity to a `selectedIndex`, creating a smooth "wave" that peaks at the selected date and fades into the past/future.

---

## Imports & Utility

```
"use client"
```
Marks this as a Client Component (needed because it uses `useMemo`, browser animations, and `motion`).

```
import { useMemo } from "react"
```
`useMemo` caches the expensive bar-height calculation so it only recomputes when its dependencies change — not on every re-render.

```
import { motion } from "motion/react"
```
Framer Motion's `motion` lets us animate DOM elements declaratively. Here it animates each bar's height.

```
function gaussian(x: number, sigma: number) {
  return Math.exp(-(x * x) / (2 * sigma * sigma))
}
```
The **Gaussian function** (bell curve). Given a distance `x` and spread `sigma`, it returns a value near `1` when `x` is close to `0`, and approaches `0` as `x` grows. This creates the smooth falloff — bars near `selectedIndex` are tall, bars farther away are short.

---

## Component Props

```
datesLength, subBars, selectedIndex, viewingCurrentMonth, todayDate
```

- `datesLength` — total number of date entries  
- `subBars` — how many micro-bars each date entry gets (smooths the wave)  
- `selectedIndex` — which date is "highlighted" (the wave peaks here)  
- `viewingCurrentMonth` — boolean; when true, future dates are dimmed  
- `todayDate` — the index of "today", used to determine what counts as future

---

## `bars` Memo

```
const total = datesLength * subBars
```
Total number of individual bars to render.

```
const base = 4
const peak = 28
```
Every bar's height ranges from `4px` (minimum, far away) to `28px` (maximum, at the center).

```
return Array.from({ length: total }, (_, idx) => {
```
Creates an array of `total` bar objects.

```
const i = Math.floor(idx / subBars)
```
`i` = which date entry this bar belongs to.

```
const sub = (idx % subBars) / subBars
```
`sub` = fractional position within that date entry (0 to just-under 1). This gives the smooth sub-bar resolution.

```
const pos = i + sub
```
Continuous position combining the date index + fractional sub-bar offset.

```
const dist = Math.abs(pos - selectedIndex)
```
Distance from the selected index. When `pos === selectedIndex`, distance is 0 → peak height.

```
const height = base + (peak - base) * gaussian(dist, 1.2)
```
Height formula:
- `gaussian(dist, 1.2)` → a number 0..1 (1 at center, 0 far away)
- `(peak - base) * gaussian(...)` → the variable part, scaled to `24px` max
- `base + ...` → shift up so bars never go below `4px`

```
const isFuture = viewingCurrentMonth && i >= todayDate
```
If we're viewing the current month, bars on or after today are marked as "future" (dimmed later).

```
return { height, isFuture }
```

The dependency array ensures bars only recalculate when dates change, not on every scroll/hover.

---

## Render

```
<div className="flex h-full w-full items-end gap-px">
```
A flexbox container: items align to the bottom (bars grow upward), full width/height, 1px gaps between bars.

```
bars.map(({ height, isFuture }, i) => (
  <motion.div ...
```
Loops over every computed bar and renders an animated `<div>`.

```
key={i}
```
Stable key for React's reconciliation.

```
className="w-full origin-bottom rounded-full"
```
- `w-full` — each bar stretches to fill its flex slot  
- `origin-bottom` — height animation pivots from bottom (bars grow up)  
- `rounded-full` — pill-shaped bars

```
style={{
  opacity: isFuture ? 0.1 : 1,
  backgroundColor: "var(--primary)",
  willChange: "transform",
}}
```
- Future bars are nearly invisible (opacity 0.1)  
- Color comes from CSS custom property `--primary` (theme-aware)  
- `willChange: "transform"` hints the browser to optimize for animation

```
animate={{ height }}
transition={{
  duration: 0.35,
  ease: [0.25, 0.1, 0.25, 1],
}}
```
- **animate**: Motion will animate the `height` style from its current value to the new one whenever `height` changes  
- **duration**: 350ms — fast enough to feel responsive  
- **ease**: custom cubic bezier — a subtle ease-in-out curve
