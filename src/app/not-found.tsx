"use client"

import Link from "next/link"
import { Gamepad2, ChevronsUpDown } from "lucide-react"
import PalmLeav from "@/components/asserts/PalmLeav"
import PlamLeavRight from "@/components/asserts/plamLeavRight"
import UpLeaves from "@/components/asserts/UpLeaves"
import ThemeSwitcher from "@/components/Custom/ThemeSwitcher"
import { buttonVariants } from "@/components/ui/button"
import dynamic from "next/dynamic"

const RocketGame = dynamic(() => import("@/components/asserts/Game/rocketGame"), { ssr: false })

export default function NotFound() {
  return (
    <div className="relative flex w-full flex-col items-center px-4">
      <ThemeSwitcher className="hidden" direction="center" duration={500} />

      {/* Decorative Background Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Bottom-left large palm checked */}
        <div className="absolute -bottom-32 -left-32 opacity-50">
          <PalmLeav className="h-112.5 w-112.5 -rotate-45 sm:h-162.5 sm:w-162.5" />
        </div>

        {/* Bottom-right large palm (flipped) checked */}
        <div className="absolute -right-32 -bottom-32 scale-x-[-1] opacity-50">
          <PlamLeavRight className="h-112.5 w-112.5 rotate-180 sm:h-162.5 sm:w-162.5" />
        </div>

        {/* Top-left palm  checked */}
        <div className="absolute -top-20 -left-20 -rotate-30 opacity-50">
          <PalmLeav className="h-80 w-80 sm:h-112.5 sm:w-112.5" />
        </div>

        {/* Top-right palm (flipped) checked */}
        <div className="absolute -top-20 right-70 scale-x-[-1] rotate-30 opacity-50">
          <PlamLeavRight className="h-80 w-80 sm:h-112.5 sm:w-112.5" />
        </div>

        <div className="absolute right-100 -bottom-20 hidden scale-x-[-1] rotate-200 opacity-50 md:block">
          <PlamLeavRight className="h-100 w-100" />
        </div>

        {/* Top-left up-leaves checked */}
        <div className="absolute -top-8 left-70 opacity-50">
          <UpLeaves className="h-65 w-45 rotate-180 sm:h-90 sm:w-62.5" />
        </div>

        {/* Top-right up-leaves (mirrored) checked */}
        <div className="absolute -top-8 right-4 opacity-50">
          <UpLeaves className="h-65 w-45 rotate-180 sm:h-90 sm:w-62.5" />
        </div>

        {/* Mid-left up-leaves checked */}
        <div className="absolute top-100 left-0 -translate-y-1/2 opacity-50">
          <UpLeaves className="h-52 w-36 rotate-90 sm:h-72 sm:w-50" />
        </div>

        {/* Mid-right up-leaves (mirrored) checked */}
        <div className="absolute top-120 right-0 -translate-y-1/2 scale-x-[-1] opacity-50">
          <UpLeaves className="h-52 w-36 rotate-90 sm:h-72 sm:w-50" />
        </div>

        {/* Lower-mid left up-leaves checked */}
        <div className="absolute -bottom-14 left-0 translate-y-1/2 opacity-50">
          <UpLeaves className="h-60 w-40 sm:h-100 sm:w-56" />
        </div>

        {/* Additional bottom up-leaves scattered checked */}
        <div className="absolute -bottom-15 left-100 -translate-x-1/2 opacity-50">
          <UpLeaves className="h-40 w-28 sm:h-40 sm:w-40" />
        </div>

        <div className="absolute -bottom-15 left-130 hidden -translate-x-1/2 opacity-50 md:block">
          <UpLeaves className="h-170 w-68" />
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center">
        {/* 404 */}
        <h1 className="font-pixelify text-[7rem] leading-none font-bold tracking-tighter sm:text-[10rem] md:text-[14rem] lg:text-[16rem]">
          <span className="bg-linear-to-r from-primary via-primary/70 to-primary/40 bg-clip-text text-transparent dark:from-primary dark:via-primary/70 dark:to-primary/40">
            404
          </span>
        </h1>

        {/* Decorative divider line */}
        <div className="mb-4 h-0.5 w-20 rounded-full bg-primary/20 dark:bg-primary/10" />

        {/* Message */}
        <p className="max-w-md text-base text-balance text-muted-foreground sm:text-lg">
          Looks like you&apos;ve wandered off the forest path.
          <br />
          <span className="text-sm sm:text-base">
            The page you&apos;re looking for has vanished into the woods.
          </span>
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className={buttonVariants({
              variant: "default",
              className: "gap-2 rounded-full px-6",
            })}
          >
            Return Home
          </Link>

          <Link
            href="/blog"
            className={buttonVariants({
              variant: "outline",
              className: "gap-2 rounded-full px-6",
            })}
          >
            Visit Blog
          </Link>

          <a
            href="#game-section"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("game-section")?.scrollIntoView({ behavior: "smooth" })
            }}
            className={buttonVariants({
              variant: "outline",
              className: "group/game gap-2 rounded-full backdrop-blur-xs",
            })}
          >
            <Gamepad2 size={16} className="transition-transform group-hover/game:translate-x-0.5 group-hover/game:-translate-y-0.5" />
            Bored? Play a Game
          </a>
        </div>

        {/* Scroll hint */}
        <div className="mt-8 flex animate-bounce flex-col items-center gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Keep going, there&apos;s a game below
          </span>
          <ChevronsUpDown size={20} className="text-muted-foreground/40" />
        </div>
      </div>

      {/* Rocket Game Section */}
      <section id="game-section" className="relative z-10 mb-8 w-full max-w-4xl">
        <div className="mb-6 text-center">
          <h2 className="font-pixelify text-2xl font-bold tracking-tight sm:text-3xl">
            <span className="bg-linear-to-r from-primary via-primary/70 to-primary/40 bg-clip-text text-transparent dark:from-primary dark:via-primary/70 dark:to-primary/40">
              Bored? Play a Game
            </span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Navigate your spaceship through asteroid fields!
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background/60 p-1 shadow-lg backdrop-blur-sm">
          <RocketGame className="h-[500px] w-full sm:h-[600px]" />
        </div>
      </section>
    </div>
  )
}
