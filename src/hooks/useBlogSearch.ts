"use client"

import { useMemo } from "react"
import type { BlogPost } from "@/data/blog"

type BlogData = (BlogPost & { content: string })[]

export interface BlogSearchMatch {
  id: string
  match: string
  tag: string
}

export interface BlogSearchResult {
  blog: string
  slug: string
  matches: BlogSearchMatch[]
}

const TEXT_TAGS =
  /<(p|li|h[1-6]|a|strong|em|span|blockquote|td|th|figcaption)[^>]*?id="([^"]*)"[^>]*>([\s\S]*?)<\/\1>/gi

function extractContentElements(
  html: string
): { id: string; text: string; tag: string }[] {
  const elements: { id: string; text: string; tag: string }[] = []
  let match: RegExpExecArray | null
  while ((match = TEXT_TAGS.exec(html)) !== null) {
    const text = match[3].replace(/<[^>]+>/g, "").trim()
    if (text) {
      elements.push({ id: match[2], text, tag: match[1] })
    }
  }
  return elements
}

export function useBlogSearch(
  allBlogs: BlogData | null,
  searchQuery: string
): BlogSearchResult[] {
  return useMemo(() => {
    if (!allBlogs || !searchQuery.trim()) return []

    const q = searchQuery.toLowerCase()

    return allBlogs.reduce<BlogSearchResult[]>((acc, blog) => {
      const matches: BlogSearchMatch[] = []

      const titleLower = blog.title.toLowerCase()
      if (titleLower.includes(q)) {
        const idx = titleLower.indexOf(q)
        const matched = blog.title.slice(idx, idx + q.length)
        const before = blog.title.slice(Math.max(0, idx - 20), idx)
        const after = blog.title.slice(idx + q.length, idx + q.length + 20)
        matches.push({
          id: `title:${blog.slug}`,
          match: `${before}<marks>${matched}<marks>${after}`,
          tag: "title",
        })
      }

      const elements = extractContentElements(blog.content)

      for (const el of elements) {
        const textLower = el.text.toLowerCase()
        let pos = 0
        while (true) {
          const idx = textLower.indexOf(q, pos)
          if (idx === -1) break

          const matched = el.text.slice(idx, idx + q.length)
          const before = el.text.slice(Math.max(0, idx - 40), idx)
          const after = el.text.slice(idx + q.length, idx + q.length + 40)

          matches.push({
            id: el.id,
            match: `${before}<marks>${matched}<marks>${after}`,
            tag: el.tag,
          })

          pos = idx + 1
        }
      }

      if (matches.length > 0) {
        acc.push({ blog: blog.title, slug: blog.slug, matches })
      }

      return acc
    }, [])
  }, [allBlogs, searchQuery])
}
