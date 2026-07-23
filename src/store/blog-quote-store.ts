import { create } from "zustand"

export const defaultQuote = "click to read any blog"

const blogQuotes = [
  "Totally Human written article",
  "probably you will love that",
  "i am lost in woods while writing this article",
  "written under a full moon",
  "not every article needs a point",
  "raw unfiltered storytelling ahead",
  "some words fell out of my brain",
  "made with love and late-night coffee",
  "this one hit different while writing",
  "zero AI vibes, just pure thoughts",
  "dropped my thoughts here, handle with care",
  "this one is straight from the heart",
]

export function getRandomBlogQuote(): string {
  return blogQuotes[Math.floor(Math.random() * blogQuotes.length)]
}

interface BlogQuoteState {
  quote: string
  setQuote: (quote: string) => void
}

export const useBlogQuoteStore = create<BlogQuoteState>((set) => ({
  quote: defaultQuote,
  setQuote: (quote) => set({ quote }),
}))
