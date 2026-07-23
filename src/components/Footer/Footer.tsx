"use client"
import Link from "next/link"
import { NavIcon } from "../asserts/Icon/nav-icons"
import {
  navRoutes,
  SocialLink,
  socialLinks,
  type RouteGroup,
  type SocialLinkGroup,
} from "@/data/data"
import { quotes } from "@/lib/quote"
import { useState, useEffect } from "react"
import { useSoundEffect } from "@/hooks/useSoundEffect"
import { toast } from "sonner"
import { type MouseEvent } from "react"
import Curv from "../asserts/Curv"

const routeGroups: RouteGroup[] = ["navigate", "explore"]

const groupedRoutes = routeGroups
  .map((group) => ({
    group,
    links: navRoutes.filter((route) => route.footer && route.group === group),
  }))
  .filter(({ links }) => links.length > 0)

const Footer = () => {
  const [quote, setQuote] = useState<{
    text: string
    author: string
    source: string
  } | null>(null)
  const { play } = useSoundEffect("error")

  useEffect(() => {
    const id = setTimeout(() => {
      const index = Math.floor(Math.random() * quotes.length)
      setQuote(quotes[index])
    }, 0)
    return () => clearTimeout(id)
  }, [])

  const socialLinkGroups: SocialLinkGroup[] = ["social", "work", "creator"]

  const groupedSocialLinks = socialLinkGroups
    .map((group) => ({
      group,
      links: socialLinks.filter((item) => item.group === group),
    }))
    .filter(({ links }) => links.length > 0)

  const handleSocialClick = (
    event: MouseEvent<HTMLAnchorElement>,
    item: SocialLink
  ) => {
    if (!item.disabled) return

    event.preventDefault()
    play()
    toast.warning("In pending available soon... :)")
  }

  return (
    <>
      <footer className="relative mt-5 w-full overflow-visible text-background">
        <Curv className="left-0 -mb-1 hidden h-auto w-88 scale-x-[-1] scale-y-[-1] text-foreground vs:block" />
        <div className="rounded-tr-sm bg-foreground pb-2">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 pt-8 text-sm sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl space-y-5">
              {quote && (
                <blockquote className="wrap-break-words relative max-w-80 pt-1 text-background/75 vs:-mt-16">
                  <p className="text-balance">{quote.text}</p>

                  <cite className="mt-2 block text-xs text-background/70 not-italic">
                    — {quote.author}, {quote.source}
                  </cite>
                </blockquote>
              )}

              <div>
                <nav
                  aria-label="Footer routes"
                  className="flex flex-wrap gap-x-5 gap-y-3"
                >
                  {groupedRoutes.map(({ group, links }) => (
                    <div key={group} className="flex flex-col gap-1">
                      <span className="text-[10px] font-semibold tracking-widest text-background/70 uppercase">
                        {group}
                      </span>
                      <div className="gap-0.1 flex flex-col">
                        {links.map((route) => (
                          <Link
                            key={route.href}
                            href={route.href}
                            className="relative flex items-center gap-1 py-1.5 text-background/60 transition-colors hover:text-background focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
                          >
                            <NavIcon icon={route.icon} size={16} />
                            <span className="text-xs">{route.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
            </div>

            <nav
              aria-label="Social links"
              className="flex flex-wrap gap-x-5 gap-y-3 sm:justify-end"
            >
              {groupedSocialLinks.map(({ group, links }) => (
                <div key={group} className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold tracking-widest text-background/70 uppercase">
                    {group}
                  </span>
                  <div className="gap-0.1 flex flex-col">
                    {links.map((item) => (
                      <Link
                        key={item.index}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-disabled={item.disabled}
                        onClick={(e) => handleSocialClick(e, item)}
                        className={`relative flex items-center gap-2 rounded-sm py-1.5 text-background/60 transition-colors hover:text-background focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none ${item.disabled ? "opacity-30 saturate-100" : ""}`}
                      >
                        <item.Icon width={13} height={13} />
                        <span className="text-xs">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
          <div className="mt-6 pb-4 text-center text-[10px] tracking-wider text-background/70">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-extrabold">ALOK</span>. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
