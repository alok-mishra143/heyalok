"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import WaveCurve from "@/components/asserts/arrows/WaveArrow"
import {
  useBlogQuoteStore,
  getRandomBlogQuote,
  defaultQuote,
} from "@/store/blog-quote-store"

export default function BlogQuoteDisplay() {
  const pathname = usePathname()
  const quote = useBlogQuoteStore((s) => s.quote)
  const setQuote = useBlogQuoteStore((s) => s.setQuote)

  useEffect(() => {
    if (pathname === "/blog") {
      setQuote(defaultQuote)
    } else if (pathname.startsWith("/blog/")) {
      setQuote(getRandomBlogQuote())
    }
  }, [pathname, setQuote])

  return (
    <div className="flex items-start gap-1">
      <WaveCurve className="shrink-0 text-muted-foreground rotate-180" strokeWidth={1} />
      <AnimatePresence mode="popLayout">
        <motion.p
          key={quote}
          className="text-left text-sm italic leading-snug text-muted-foreground whitespace-nowrap"
        >
          {quote.split(" ").map((word, i) => (
            <motion.span
              key={`${quote}-${i}`}
              className="inline-block"
              initial={{ filter: "blur(6px)", opacity: 0 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              transition={{ delay: i * 0.08, duration: 0.25 }}
            >
              {word}&nbsp;
            </motion.span>
          ))}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
