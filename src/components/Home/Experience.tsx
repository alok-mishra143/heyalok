"use client"

import type { Experience } from "@/data/experiences"
import { getTagIcon } from "@/data/tag-icons"
import type { ToolIcon } from "@/data/tools"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import Image from "next/image"
import { HoverTracker } from "../ui/hover-tracker"

function TagIcon({ icon, name }: { icon: ToolIcon; name: string }) {
  if (typeof icon === "string") {
    return (
      <Image
        src={icon}
        alt={name}
        width={14}
        height={14}
        className="size-3.5 shrink-0"
        loading="lazy"
        unoptimized
      />
    )
  }
  return (
    <>
      <Image
        src={icon.light}
        alt={name}
        width={14}
        height={14}
        className="block size-3.5 shrink-0 dark:hidden"
        loading="lazy"
        unoptimized
      />
      <Image
        src={icon.dark}
        alt={name}
        width={14}
        height={14}
        className="hidden size-3.5 shrink-0 dark:block"
        loading="lazy"
        unoptimized
      />
    </>
  )
}

function Experience({ experiences }: { experiences: Experience[] }) {
  return (
    <div className="space-y-6">
      <div className="font-pixel">
        <h2 className="text-2xl">Experience</h2>
      </div>

      <div className="relative">
        <div className="absolute top-3 bottom-3 left-0 z-40 w-px rounded-full bg-gradient-to-b from-primary via-primary/30 to-transparent" />

        <Accordion className="space-y-2 border-none">
          {experiences.map((item) => (
            <AccordionItem
              key={`${item.company}-${item.role}`}
              value={`${item.company}-${item.role}`}
              className="group relative rounded-sm border border-transparent py-4 pr-4 pl-8 transition-all duration-200 data-open:bg-muted/10"
            >
              <AccordionTrigger className="gap-3 p-0 hover:no-underline">
                <div className="w-full text-left">
                  <span className="font-pixel text-[11px] tracking-wider text-muted-foreground">
                    {item.period}
                  </span>

                  <h3 className="mt-1 text-lg font-semibold">
                    {item.role}
                    <span className="font-normal text-muted-foreground">
                      {" "}
                      &middot; {item.company}
                    </span>
                  </h3>

                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>
                  {item.tags.length > 0 && (
                    <HoverTracker hoverAttr="skill">
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => {
                          const icon = getTagIcon(tag)
                          return (
                            <span
                              key={tag}
                              data-hover="skill"
                              className="inline-flex items-center gap-1 rounded-sm border border-dashed border-muted px-2 py-1 font-mono text-[11px] text-muted-foreground transition-all duration-200"
                            >
                              {icon && <TagIcon icon={icon} name={tag} />}
                              {tag}
                            </span>
                          )
                        })}
                      </div>
                    </HoverTracker>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-0 pb-0">
                <div className="space-y-1.5 pt-3">
                  {item.details.slice(1).map((detail, i) => (
                    <p
                      key={i}
                      className="relative pl-3 text-sm leading-relaxed text-muted-foreground before:absolute before:top-[7px] before:left-0 before:size-1 before:rounded-full before:bg-muted-foreground/30"
                    >
                      {detail}
                    </p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

export default Experience
