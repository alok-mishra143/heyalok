"use client"
import { type MouseEvent } from "react"
import { toast } from "sonner"

import { socialLinks, type SocialLink, type SocialLinkGroup } from "@/data/data"
import ExpandableImage from "./ExpandableImage"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../animate-ui/components/animate/tooltip"
import { TooltipProvider } from "../animate-ui/components/animate/tooltip-provider"
import ViewCount from "../Custom/ViewCount"
import { useSoundEffect } from "@/hooks/useSoundEffect"
import Link from "next/link"

const socialLinkGroups: SocialLinkGroup[] = ["social", "work", "creator"]

const groupedSocialLinks = socialLinkGroups
  .map((group) => ({
    group,
    links: socialLinks.filter((item) => item.group === group),
  }))
  .filter(({ links }) => links.length > 0)

const Profile = () => {
  const { play } = useSoundEffect("error")

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
    <div className={`h-auto w-full pt-40`}>
      <div className="flex w-full items-start gap-2">
        <ExpandableImage
          src="/alokm.avif"
          width={120}
          height={120}
          quality={100}
          className="min- relative -mt-15 ml-2 h-30 w-30 overflow-hidden rounded-md bg-background/40 backdrop-blur-3xl"
          imgClassName="h-full w-full object-cover"
          sizes="120px"
          alt="Alok Mishra profile Profile"
        />

        <div className="flex flex-1 flex-col gap-1">
          <div className="flex w-full justify-between">
            <h1 className="flex gap-1 font-pixelify text-xl leading-none sm:text-2xl md:text-3xl">
              ALOK MISHRA
            </h1>
            <ViewCount />
          </div>

          <div className="flex w-full font-pixel leading-none">
            <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 vs:gap-2">
              <TooltipProvider>
                {groupedSocialLinks.map(({ group, links }, groupIndex) => (
                  <div
                    key={group}
                    className="flex items-center gap-x-1 vs:gap-2"
                  >
                    {groupIndex > 0 ? (
                      <span
                        aria-hidden="true"
                        className="hidden text-primary/40 vs:inline"
                      >
                        /
                      </span>
                    ) : null}

                    <div className="flex items-center gap-x-1 vs:gap-2">
                      {links.map((item) => (
                        <Tooltip key={item.index}>
                          <TooltipTrigger asChild>
                            <Link
                              href={item.href}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={item.label}
                              aria-disabled={item.disabled}
                              onClick={(event) =>
                                handleSocialClick(event, item)
                              }
                              className={`flex w-auto items-center justify-center rounded-sm text-primary transition-colors hover:text-primary/70 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none ${item.disabled ? "opacity-30 saturate-100" : ""}`}
                            >
                              <item.Icon width={18} height={18} />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span className="text-xs">{item.label}</span>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
