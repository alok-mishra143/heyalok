"use client"

import { useRef } from "react"
import type { BlogPost } from "@/data/blog"
import { useBlogData } from "@/hooks/useBlogData"
import BlogCardList from "./BlogCardList"
import Link from "next/link"
import { motion, useInView } from "motion/react"
import CoolDude from "../asserts/blog/CoolDude"
import { HoverTracker } from "../ui/hover-tracker"

type PostData = BlogPost & { content: string }

function BlogCardItem({ post, index }: { post: BlogPost; index: number }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-40px" })
  return (
    <motion.div
      ref={cardRef}
      layout
      data-hover="card-element"
      className="mb-4 last:mb-0"
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(8px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(12px)", transition: { duration: 0.25 } }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <BlogCardList post={post} />
      </Link>
    </motion.div>
  )
}

export function BlogList({ posts: postsProp }: { posts?: PostData[] }) {
  const { data: postsFromStore } = useBlogData()
  const posts = postsProp ?? postsFromStore

  if (!posts) return null

  return (
    <div>
      <div className="flex flex-col">
        <HoverTracker>

        {posts.map((post, index) => (
          <BlogCardItem key={post.link} post={post} index={index} />
        ))}
        </HoverTracker>
      </div>

      <div className="fixed top-72 left-20 z-10 hidden min-[1400px]:block">
        <span className="flex translate-x-36 text-xs leading-tight text-primary/70">
          Lowkey, my blogs are fire.....
        </span>
        <CoolDude />
      </div>
    </div>
  )
}
