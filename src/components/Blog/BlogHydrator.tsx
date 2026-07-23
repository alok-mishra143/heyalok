"use client"

import { useEffect } from "react"
import { useBlogStore } from "@/store/blog-store"
import type { BlogPost } from "@/data/blog"

type BlogData = (BlogPost & { content: string })[]

export function BlogHydrator({ data }: { data: BlogData }) {
  const setData = useBlogStore((s) => s.setData)

  useEffect(() => {
    setData(data)
  }, [data, setData])

  return null
}
