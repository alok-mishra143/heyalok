"use client"
import { cn } from "@/lib/utils"
import React from "react"
import Cat from "../asserts/Cat"

import UpLeaves from "../asserts/UpLeaves"

import { useSoundEffect } from "@/hooks/useSoundEffect"
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation"
import { ProgressiveBlur } from "../ui/progressiveBlur"
import { useScrollProgress } from "@/hooks/useScroll"
import PalmLeav from "../asserts/PalmLeav"
import Image from "next/image"

interface GlobalWrapperprops {
  className?: string
  children: React.ReactNode
}

const GlobalWrapper: React.FC<GlobalWrapperprops> = ({
  className,
  children,
}) => {
  const progress = useScrollProgress()
  const { play } = useSoundEffect("cutemeow")
  useKeyboardNavigation()

  const fadeStart = 0.9

  const opacity =
    progress < fadeStart ? 1 : 1 - (progress - fadeStart) / (1 - fadeStart)

  return (
    <div
      className={cn(
        "relative flex min-h-lvh w-full justify-center gap-1 overflow-x-hidden bg-background",
        className
      )}
    >
      <div className="relative z-10 flex min-h-lvh w-full max-w-2xl min-w-0 flex-col p-1">
        {children}

        <div className="relative" style={{ opacity }}>
          <ProgressiveBlur
            className="fixed bottom-0 left-1/2 z-10 w-full max-w-4xl -translate-x-1/2"
            height="4rem"
          />
        </div>
      </div>
      {/* left side leaves*/}
      <div
        className="pointer-events-none fixed bottom-0 left-0 z-50 hidden h-64 w-56 opacity-80 min-[1400px]:block"
        aria-hidden="true"
      >
        <UpLeaves className="absolute bottom-0 -left-10 h-20 w-28 rotate-30" />
        <UpLeaves className="absolute -bottom-2 -left-1 h-20 w-28 -rotate-30" />
        <UpLeaves className="absolute -bottom-10 -left-6 h-20 w-28" />
      </div>

      {/* right side leaves*/}

      <div className="fixed right-3 bottom-0 z-50 ml-3 hidden h-96 w-96 min-[1400px]:block">
        <Cat
          className="absolute -bottom-5 left-40 z-50 h-30 w-30 text-foreground"
          onClick={() => play()}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-50 h-[50rem] w-[50rem]"
        >
          <Image
            src={"/tree.avif"}
            width={800}
            height={533}
            alt="tree"
            fetchPriority="high"
            className="h-full w-full scale-x-[-1] object-contain object-left"
          />
        </div>
      </div>

      {/* left side above */}

      <div className="pointer-events-none fixed top-0 left-0 z-50 hidden min-[1400px]:block">
        <PalmLeav className="absolute h-20 w-auto -translate-x-10 -rotate-10" />
      </div>
    </div>
  )
}

export default GlobalWrapper
