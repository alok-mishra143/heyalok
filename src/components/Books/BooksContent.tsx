"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "motion/react"
import { BookFiller } from "@/components/Books/BookFiller"
import { BOOKS } from "@/data/books"
import type { BookStatus } from "@/data/books"

const SECTIONS: { status: BookStatus; label: string }[] = [
  { status: "reading", label: "Reading" },
  { status: "read", label: "Read" },
  { status: "list", label: "In List" },
]

const COLS = 3

function trailingPlaceholders(count: number): number {
  if (count === 0) return COLS
  const rem = count % COLS
  return rem === 0 ? 0 : COLS - rem
}

export function BooksContent() {
  const ref0 = useRef(null)
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const isInView0 = useInView(ref0, { once: true, margin: "-40px" })
  const isInView1 = useInView(ref1, { once: true, margin: "-40px" })
  const isInView2 = useInView(ref2, { once: true, margin: "-40px" })
  const sectionRefs = [ref0, ref1, ref2]
  const sectionInViews = [isInView0, isInView1, isInView2]

  return (
    <div className="mt-8 flex flex-col gap-12">
      {SECTIONS.map(({ status, label }, i) => {
        const books = BOOKS.filter((book) => book.status === status)
        const fillers = trailingPlaceholders(books.length)
        const ref = sectionRefs[i]
        const isInView = sectionInViews[i]

        return (
          <div key={status} ref={ref}>
            <motion.h2
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 16, filter: "blur(8px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mb-4 text-sm font-medium tracking-widest text-muted-foreground uppercase"
            >
              {label}
            </motion.h2>

            <ul role="list" className="grid grid-cols-3 gap-3">
              {books.map((book, index) => (
                <motion.li
                  key={book.image}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(8px)" }}
                  transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
                >
                  <div className="group [perspective:600px]">
                    <div
                      className="relative aspect-2/3 transition-transform duration-500 ease-out group-hover:-translate-y-0.5"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="pointer-events-none absolute inset-0 rounded-lg shadow-md shadow-black/10 transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-black/30 dark:group-hover:shadow-black/60" />

                      <div className="pointer-events-none absolute inset-0 translate-x-0.5 translate-y-0.5 rounded-md bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700 transition-all duration-500 ease-out group-hover:brightness-110" />

                      <div className="book-cover absolute inset-0">
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[4px] rounded-l-md bg-gradient-to-r from-black/15 via-black/5 to-transparent dark:from-white/8 dark:via-white/3" />

                        <div className="relative h-full w-full overflow-hidden rounded-md border border-border/60 bg-muted">
                          <Image
                            src={book.url}
                            alt={`${book.title} cover`}
                            fill
                            sizes="(max-width: 768px) calc((100vw - 2rem) / 3), 216px"
                            quality={50}
                            priority={i === 0 && index === 0}
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}

              {Array.from({ length: fillers }).map((_, index) => (
                <motion.li
                  key={`filler-${status}-${index}`}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(8px)" }}
                  transition={{ duration: 0.4, delay: (books.length + index) * 0.07, ease: "easeOut" }}
                >
                  <BookFiller />
                </motion.li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
