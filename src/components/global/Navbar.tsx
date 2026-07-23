"use client"
import { useState, useRef, useEffect } from "react"
import Curv from "../asserts/Curv"
import EyeMovement from "../asserts/EyeMovement"
import Link from "next/link"
import ThemeSwitcher from "../Custom/ThemeSwitcher"
import { useTheme } from "next-themes"
import OrangeFlower from "../asserts/OrangeFlower"
import BlueFlower from "../asserts/BlueFlower"
import PalmLeav from "../asserts/PalmLeav"
import PlamLeavRight from "../asserts/plamLeavRight"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import CurvArrow1 from "../asserts/arrows/CurvArrow1"
import Fade from "../Custom/Fade"
import { NavIcon } from "../asserts/Icon/nav-icons"
import { navRoutes } from "@/data/data"
import dynamic from "next/dynamic"

const CustomDialog = dynamic(() => import("../Dialog/CustomDialog"), {
  ssr: false,
  loading: () => (
    <div className="inline-flex w-fit items-center rounded-md border p-1 text-[10px] text-muted-foreground">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-search"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <span className="flex items-center gap-1 overflow-hidden whitespace-nowrap max-md:max-w-0 max-md:opacity-0 md:ml-1 md:max-w-24">
        <kbd className="rounded border bg-muted px-1 py-[1px] font-mono text-[10px] leading-none">
          ⌘
        </kbd>
        <span className="text-[8px]">+</span>
        <kbd className="rounded border bg-muted px-1 py-[1px] font-mono text-[10px] leading-none uppercase">
          K
        </kbd>
      </span>
    </div>
  ),
})

const navItems = navRoutes.filter((route) => route.nav)

const Navbar = () => {
  const { resolvedTheme } = useTheme()
  const path = usePathname()
  const [hoveredHref, setHoveredHref] = useState<string | null>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const isRouteVisible = navItems.some((item) => item.href === path)
  const showIndicator = (hoveredHref || isRouteVisible) ?? false
  const activeHref = hoveredHref || path

  useEffect(() => {
    const link = linkRefs.current[activeHref]
    if (!link) return
    const parent = link.parentElement
    if (!parent) return
    requestAnimationFrame(() => {
      const parentRect = parent.getBoundingClientRect()
      const linkRect = link.getBoundingClientRect()
      setIndicatorStyle({
        left: linkRect.left - parentRect.left,
        width: linkRect.width,
      })
    })
  }, [activeHref])

  return (
    <header className="fixed top-0 left-1/2 z-10 flex w-full max-w-2xl -translate-x-1/2 gap-2 overflow-visible bg-background p-1 text-foreground vs:block vs:gap-0">
      <Curv className="pointer-events-none absolute top-full -right-[1.15rem] hidden h-10 w-[min(400px,calc(100%-1rem))] -translate-y-px text-background vs:block" />

      <div className="relative z-10 flex items-center justify-between overflow-x-clip">
        <Link
          href={"/"}
          aria-label="Home"
          className="group flex cursor-pointer items-center gap-2 font-pixelify text-2xl text-primary ring-0 outline-none"
        >
          <EyeMovement className="h-7.5 w-7.5 text-primary transition-colors" />
        </Link>
        <div className="absolute top-1/2 right-0 hidden w-[min(310px,calc(100%-1rem))] -translate-y-1/2 vs:flex">
          <OrangeFlower className="h-full w-21" />
        </div>

        <div className="absolute top-1/2 right-0 hidden w-[min(310px,calc(100%-1rem))] -translate-y-1/2 justify-end vs:flex">
          <BlueFlower className="h-full w-32" />
        </div>

        <div className="absolute top-1/2 right-0 hidden w-[min(310px,calc(100%-1rem))] -translate-y-1/2 justify-center vs:flex">
          <PalmLeav className="h-full w-30" />
        </div>

        <div className="absolute top-3 -right-2 hidden w-[min(310px,calc(100%-1rem))] -translate-y-1/2 justify-end vs:flex">
          <PlamLeavRight className="h-full w-20" />
        </div>

        <Fade
          direction="up"
          className="absolute -top-2 -right-10 z-10 hidden h-10 w-[min(400px,calc(100%-1rem))] vs:flex"
        />
        <Fade
          direction="right"
          className="absolute -top-2 right-0 z-10 hidden h-20 w-10 vs:flex"
        />
      </div>

      <nav
        className={cn(
          "relative z-10 flex h-10 min-w-0 flex-1 items-end text-sm font-medium text-primary vs:absolute vs:top-5 vs:right-0 vs:h-14 vs:w-[min(300px,calc(100%-1rem))] vs:flex-none vs:-translate-y-px"
        )}
      >
        <div className="flex w-full min-w-0 items-center justify-between gap-1 pr-2 sm:pr-0">
          <div
            className="relative flex min-w-0 items-center gap-1.5"
            onMouseLeave={() => setHoveredHref(null)}
          >
            {showIndicator && (
              <div
                className="pointer-events-none absolute bottom-0 transition-[left,width] duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
                style={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                }}
              >
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              </div>
            )}
            {navItems.map((item) => {
              const isActive = path === item.href
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className={cn(
                    "relative flex items-center px-0.5 py-1 ring-0",
                    isActive && "text-primary/80",
                    isActive && "font-extrabold"
                  )}
                  onMouseEnter={() => setHoveredHref(item.href)}
                  onFocus={() => setHoveredHref(item.href)}
                  onBlur={() => setHoveredHref(null)}
                  ref={(el) => {
                    linkRefs.current[item.href] = el
                  }}
                >
                  <span className="text-md flex cursor-pointer items-center gap-0.5 font-pixel">
                    <NavIcon icon={item.icon} />
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="flex gap-2">
            <CustomDialog />
            <div className="relative flex shrink-0 items-center">
              <ThemeSwitcher
                className="relative z-20"
                direction={resolvedTheme === "dark" ? "bottom" : "top"}
                duration={500}
              />

              <div className="pointer-events-none absolute top-0 left-1/2 hidden w-64 translate-x-5 text-primary lg:block">
                <CurvArrow1
                  ClassName="h-auto w-28 -rotate-6 text-primary/40"
                  strokeWidth={2.5}
                />

                <span className="mt-1 block translate-x-30 -translate-y-10 text-xs leading-tight text-primary/70">
                  Click here to switch the theme or press d
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
