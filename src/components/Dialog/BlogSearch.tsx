"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronsUpDown, Text, List, Heading } from "lucide-react"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useBlogData } from "@/hooks/useBlogData"
import { useBlogSearch } from "@/hooks/useBlogSearch"
import { useDialogStore } from "@/store/dialog-store"
import type { BlogSearchMatch } from "@/hooks/useBlogSearch"

type BlogSearchProps = {
  onNavigate?: () => void
}

const tagStyles: Record<string, string> = {
  title: "font-semibold text-primary",
  h1: "font-bold text-base text-foreground",
  h2: "font-bold text-sm text-foreground",
  h3: "font-semibold text-sm text-foreground",
  h4: "font-medium text-sm text-foreground",
  h5: "font-medium text-sm text-foreground",
  h6: "font-medium text-sm text-foreground",
  p: "text-sm text-muted-foreground leading-relaxed",
  li: "text-sm text-muted-foreground",
  a: "text-sm text-primary underline underline-offset-2 decoration-primary/30",
  span: "text-sm text-muted-foreground",
  strong: "text-sm font-semibold text-foreground",
  em: "text-sm italic text-muted-foreground",
  blockquote:
    "text-sm italic text-muted-foreground border-l-2 border-muted/50 pl-2",
  td: "text-sm text-muted-foreground",
  th: "text-sm font-semibold text-foreground",
  figcaption: "text-sm text-muted-foreground",
}

const BlogSearch = ({ onNavigate }: BlogSearchProps) => {
  const { data: blogs } = useBlogData()
  const { searchQuery } = useDialogStore()
  const results = useBlogSearch(blogs ?? null, searchQuery)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  if (results.length === 0) return null

  const toggleCollapse = (slug: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  return (
    <nav aria-label="Blog search" className="flex flex-col gap-4 mb-5">
      <DialogHeader>
        <DialogTitle className="font-pixel text-sm leading-none font-extrabold text-primary">
          Blogs
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-3">
        {results.map((blogResult) => {
          const isCollapsed = collapsed.has(blogResult.slug)
          return (
            <div
              key={blogResult.slug}
              className="rounded-lg border bg-muted/40"
            >
              <button
                type="button"
                onClick={() => toggleCollapse(blogResult.slug)}
                className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors hover:bg-muted/60 focus-visible:outline-1 focus-visible:outline-dashed focus-visible:outline-foreground/20 focus-visible:outline-offset-1"
              >
                <span className="text-sm font-semibold text-foreground">
                  {blogResult.blog}
                </span>
                <ChevronsUpDown
                  size={14}
                  className={`shrink-0 text-muted-foreground transition-transform duration-200`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-200 ${
                  isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-1 px-3 pb-3">
                    {blogResult.matches.map((match, i) => (
                      <MatchRow
                        key={`${blogResult.slug}-${i}`}
                        match={match}
                        slug={blogResult.slug}
                        onNavigate={onNavigate}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </nav>
  )
}

type MatchRowProps = {
  match: BlogSearchMatch
  slug: string
  onNavigate?: () => void
}

function MatchRow({ match, slug, onNavigate }: MatchRowProps) {
  const tag = match.tag
  const className = tagStyles[tag] ?? "text-xs text-muted-foreground"
  const href = tag === "title" ? `/blog/${slug}` : `/blog/${slug}#${match.id}`
  const { setSearchQuery } = useDialogStore()

  const Icon =
    tag === "p"
      ? Text
      : tag === "li"
        ? List
        : tag.startsWith("h")
          ? Heading
          : null

  return (
    <Link
      href={href}
      data-hover="card-element"
      onClick={() => {
        onNavigate?.()
        setSearchQuery("")
      }}
      className={`group flex items-start gap-2.5 rounded-md px-3 text-left transition-colors ${
        tag === "title" ? "py-2" : tag.startsWith("h") ? "py-1.5" : "py-1"
      } focus-visible:bg-transparent focus-visible:outline-1 focus-visible:outline-dashed focus-visible:outline-foreground/20 focus-visible:outline-offset-1`}
    >
      {Icon && (
        <span className="mt-0.5 shrink-0 text-muted-foreground/40">
          <Icon size={13} />
        </span>
      )}
      <span className={`line-clamp-2 ${className}`}>
        ...<HighlightedText text={match.match} />...
      </span>
    </Link>
  )
}

function HighlightedText({ text }: { text: string }) {
  const parts = text.split("<marks>")
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <mark
          key={i}
          className="rounded-sm bg-yellow-200 px-0.5 text-foreground dark:bg-yellow-800"
        >
          {part}
        </mark>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export default BlogSearch
