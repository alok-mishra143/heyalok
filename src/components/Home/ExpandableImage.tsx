"use client"

import { useRef, useState, useCallback, useLayoutEffect } from "react"
import { X } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { useExpandStore } from "@/store/expand-store"

interface ExpandableImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  imgClassName?: string
  sizes?: string
  quality?: number
}

type Origin = { x: number; y: number; scale: number }

const ExpandableImage = ({
  src,
  alt,
  width,
  height,
  className,
  imgClassName,
  sizes,
  quality,
}: ExpandableImageProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const isExpanded = useExpandStore((s) => s.isExpanded)
  const setIsExpanded = useExpandStore((s) => s.setIsExpanded)
  const [origin, setOrigin] = useState<Origin | null>(null)
  const prevIsExpanded = useRef(false)

  useLayoutEffect(() => {
    if (isExpanded && !prevIsExpanded.current && !origin) {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (rect) {
        const vw = window.innerWidth
        const vh = window.innerHeight
        setOrigin({
          x: rect.left + rect.width / 2 - vw / 2,
          y: rect.top + rect.height / 2 - vh / 2,
          scale: rect.width / Math.min(vw * 0.85, vh * 0.8),
        })
      }
    }
    prevIsExpanded.current = isExpanded
  }, [isExpanded, origin])

  const open = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const expandedSize = Math.min(vw * 0.85, vh * 0.8)
      setOrigin({
        x: rect.left + rect.width / 2 - vw / 2,
        y: rect.top + rect.height / 2 - vh / 2,
        scale: rect.width / expandedSize,
      })
    }
    setIsExpanded(true)
  }, [])

  const close = useCallback(() => {
    setIsExpanded(false)
    setOrigin(null)
  }, [])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={open}
        aria-label={`Expand ${alt}`}
        tabIndex={-1}
        className="group focus-visible:none relative cursor-pointer rounded-md outline-none"
      >
        <div className={className}>
          <Image
            src={src}
            alt={alt}
            fill
            className={imgClassName}
            sizes={sizes}
            quality={quality}
            fetchPriority="high"
            loading="eager"
            style={{
              opacity: isExpanded ? 0 : 1,
              transition: "opacity 0.2s ease-in-out",
            }}
          />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && origin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"
            onClick={close}
          >
            <div className="relative">
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute -top-3 -right-3 z-10 flex size-7 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-background"
              >
                <X size={16} />
              </button>

              <motion.div
                initial={{
                  scale: origin.scale,
                  x: origin.x,
                  y: origin.y,
                  filter: "blur(8px)",
                }}
                animate={{
                  scale: 1,
                  x: 0,
                  y: 0,
                  filter: "blur(0px)",
                }}
                exit={{
                  scale: origin.scale,
                  x: origin.x,
                  y: origin.y,
                  opacity: 0,
                  filter: "blur(8px)",
                }}
                transition={{
                  type: "spring",
                  duration: 0.55,
                  bounce: 0.2,
                }}
                style={{ originX: 0.5, originY: 0.5 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={src}
                  alt={alt}
                  width={width * 5}
                  height={height * 5}
                  className="h-auto max-h-[80vh] w-auto max-w-[90vw] rounded-lg object-contain md:max-w-xl"
                  sizes="90vw"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ExpandableImage
