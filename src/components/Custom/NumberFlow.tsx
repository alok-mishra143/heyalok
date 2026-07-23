"use client"

import NumberFlowPrimitive, {
  continuous as continuousPlugin,
  type NumberFlowProps as PrimitiveProps,
} from "@number-flow/react"

type NumberFlowProps = {
  /** The number to display */
  value: number
  /** Intl.NumberFormat options (e.g. `{ style: "currency", currency: "USD" }`) */
  format?: PrimitiveProps["format"]
  /** Locale(s) for number formatting */
  locales?: PrimitiveProps["locales"]
  /** Text before the number */
  prefix?: string
  /** Text after the number */
  suffix?: string
  /** Animate through intermediate values instead of snapping digits */
  continuous?: boolean
  /** Animate each digit independently */
  isolate?: boolean
  /** Forward will-change to the element for smoother animations */
  willChange?: boolean
  /** Allow/disallow animation (default true) */
  animated?: boolean
  /** Hint the animation direction: positive = counting up, negative = down */
  trend?: PrimitiveProps["trend"]
  className?: string
  onAnimationsStart?: PrimitiveProps["onAnimationsStart"]
  onAnimationsFinish?: PrimitiveProps["onAnimationsFinish"]
}

const NumberFlow = ({
  value,
  format,
  locales,
  prefix,
  suffix,
  continuous = false,
  isolate,
  willChange,
  animated = true,
  trend,
  className,
  onAnimationsStart,
  onAnimationsFinish,
}: NumberFlowProps) => {
  const plugins = continuous ? [continuousPlugin] : undefined

  return (
    <NumberFlowPrimitive
      value={value}
      format={format}
      locales={locales}
      prefix={prefix}
      suffix={suffix}
      plugins={plugins}
      isolate={isolate}
      willChange={willChange}
      animated={animated}
      trend={trend}
      className={className}
      onAnimationsStart={onAnimationsStart}
      onAnimationsFinish={onAnimationsFinish}
    />
  )
}

export default NumberFlow
export type { NumberFlowProps }
