"use client"

import { useBlogStore } from "@/store/blog-store"
import type { BlogPost } from "@/data/blog"

type BlogData = (BlogPost & { content: string })[]

export function useBlogData(): { data: BlogData | null; isLoading: boolean } {
  const data = useBlogStore((s) => s.data)
  return { data, isLoading: !data }
}
