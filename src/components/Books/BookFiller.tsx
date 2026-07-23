"use client"

import { useEffect, useRef } from "react"
import { LINE_RANDOM_PATH } from "@/components/asserts/arrows/LineRandom"

type Tile = {
  y: number
  stretch: number
}

const SVG_W = 228
const SVG_H = 21

const SCALE_Y = 1.8
const BASE_LINE_WIDTH = 0.7
const HOVER_LINE_WIDTH = 1.2
const HIT_LINE_WIDTH = 8

export function BookFiller() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const colorProbeRef = useRef<HTMLSpanElement>(null)

  const tilesRef = useRef<Tile[]>([])
  const hoverIndexRef = useRef<number | null>(null)
  const activeIndexRef = useRef<number | null>(null)

  const startXRef = useRef(0)
  const startStretchRef = useRef(1)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    const probe = colorProbeRef.current
    if (!wrapper || !canvas || !probe) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const path = new Path2D(LINE_RANDOM_PATH)
    let drawFrame: number | null = null

    const getBaseMatrix = (width: number, height: number) => {
      return new DOMMatrix()
        .translate(width / 2, height / 2)
        .rotate(-45)
        .translate(-width / 2, -height / 2)
    }

    const getTileMatrix = (width: number, height: number, tile: Tile) => {
      const scaleX = width / SVG_W

      return getBaseMatrix(width, height)
        .translate(width / 2, tile.y)
        .scale(scaleX * tile.stretch, SCALE_Y)
        .translate(-SVG_W / 2, 0)
    }

    const draw = () => {
      const dpr = window.devicePixelRatio || 1
      const { width, height } = wrapper.getBoundingClientRect()

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      const color = getComputedStyle(probe).color
      const diag = Math.sqrt(width * width + height * height)
      const rowGap = SVG_H * SCALE_Y + 24

      if (tilesRef.current.length === 0) {
        const tiles: Tile[] = []

        for (let y = -diag; y < height + diag; y += rowGap) {
          tiles.push({ y, stretch: 1 })
        }

        tilesRef.current = tiles
      }

      tilesRef.current.forEach((tile, index) => {
        const isHover = hoverIndexRef.current === index
        const isActive = activeIndexRef.current === index
        const matrix = getTileMatrix(width, height, tile)

        ctx.save()
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.transform(
          matrix.a,
          matrix.b,
          matrix.c,
          matrix.d,
          matrix.e,
          matrix.f
        )

        if (isHover || isActive) {
          ctx.save()
          ctx.strokeStyle = color
          ctx.globalAlpha = 0.18
          ctx.lineCap = "round"
          ctx.lineJoin = "round"
          ctx.lineWidth = 8 / SCALE_Y
          ctx.stroke(path)
          ctx.restore()
        }

        ctx.strokeStyle = color
        ctx.globalAlpha = isActive ? 0.9 : isHover ? 0.75 : 0.25
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.lineWidth =
          (isHover || isActive ? HOVER_LINE_WIDTH : BASE_LINE_WIDTH) / SCALE_Y

        ctx.stroke(path)
        ctx.restore()
      })
    }

    const scheduleDraw = () => {
      if (drawFrame !== null) {
        cancelAnimationFrame(drawFrame)
      }

      drawFrame = requestAnimationFrame(() => {
        drawFrame = null
        draw()
      })
    }

    const getHitIndex = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = event.clientX - rect.left
      const my = event.clientY - rect.top

      const { width, height } = rect

      for (let i = tilesRef.current.length - 1; i >= 0; i--) {
        const tile = tilesRef.current[i]
        const matrix = getTileMatrix(width, height, tile)
        const inverse = matrix.inverse()

        const point = new DOMPoint(mx, my).matrixTransform(inverse)

        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.lineWidth = HIT_LINE_WIDTH / SCALE_Y

        const hit = ctx.isPointInStroke(path, point.x, point.y)

        ctx.restore()

        if (hit) return i
      }

      return null
    }

    const onMove = (event: PointerEvent) => {
      if (activeIndexRef.current !== null) {
        const diff = event.clientX - startXRef.current

        const nextStretch = Math.max(
          0.5,
          Math.min(2.8, startStretchRef.current + diff / 140)
        )

        tilesRef.current[activeIndexRef.current].stretch = nextStretch
        draw()
        return
      }

      const hitIndex = getHitIndex(event)

      if (hoverIndexRef.current !== hitIndex) {
        hoverIndexRef.current = hitIndex
        canvas.style.cursor = hitIndex === null ? "default" : "ew-resize"
        draw()
      }
    }

    const onDown = (event: PointerEvent) => {
      const hitIndex = getHitIndex(event)
      if (hitIndex === null) return

      activeIndexRef.current = hitIndex
      hoverIndexRef.current = hitIndex
      startXRef.current = event.clientX
      startStretchRef.current = tilesRef.current[hitIndex].stretch

      canvas.setPointerCapture(event.pointerId)
      draw()
    }

    const onUp = (event: PointerEvent) => {
      activeIndexRef.current = null

      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId)
      }

      draw()
    }

    const onLeave = () => {
      if (activeIndexRef.current !== null) return

      hoverIndexRef.current = null
      canvas.style.cursor = "default"
      draw()
    }

    const resizeObserver = new ResizeObserver(() => {
      tilesRef.current = []
      draw()
    })

    const themeObserver = new MutationObserver(scheduleDraw)

    resizeObserver.observe(wrapper)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    })
    draw()

    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerdown", onDown)
    canvas.addEventListener("pointerup", onUp)
    canvas.addEventListener("pointercancel", onUp)
    canvas.addEventListener("pointerleave", onLeave)

    return () => {
      if (drawFrame !== null) {
        cancelAnimationFrame(drawFrame)
      }

      resizeObserver.disconnect()
      themeObserver.disconnect()

      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerdown", onDown)
      canvas.removeEventListener("pointerup", onUp)
      canvas.removeEventListener("pointercancel", onUp)
      canvas.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="aspect-2/3 overflow-hidden rounded-md border border-primary/20"
    >
      <span
        ref={colorProbeRef}
        className="sr-only text-primary"
        aria-hidden="true"
      />

      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
    </div>
  )
}
