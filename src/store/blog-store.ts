import { create } from "zustand"
import type { BlogPost } from "@/data/blog"

type BlogData = (BlogPost & { content: string })[]

interface BlogState {
  data: BlogData | null
  setData: (data: BlogData) => void
}

export const useBlogStore = create<BlogState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}))
