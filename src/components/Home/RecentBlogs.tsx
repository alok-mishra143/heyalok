"use client"

import { useBlogData } from "@/hooks/useBlogData"
import BlogCardList from "@/components/Blog/BlogCardList"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import CurvArrow1 from "../asserts/arrows/CurvArrow1"
import { HoverTracker } from "../ui/hover-tracker"

const RecentBlogs = () => {
  const { data: posts } = useBlogData()

  const recentPosts = posts?.slice(0, 2)

  if (!recentPosts || recentPosts.length === 0) return null

  return (
    <div className="relative space-y-6">
      <div className="pointer-events-none absolute top-30 -left-38 z-50 hidden lg:block">
        <CurvArrow1
          ClassName="h-auto w-28 -rotate-180 -scale-y-100 text-primary/40"
          strokeWidth={2.5}
        />
        <span className="flex -translate-x-32 -translate-y-10 text-xs leading-tight text-primary/70">
          wana read blogs ??
        </span>
      </div>
      <div className="font-pixel">
        <h2 className="text-2xl">Recent Blogs</h2>
      </div>

      <HoverTracker className="flex flex-col gap-4">
        {recentPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <BlogCardList post={post} />
          </Link>
        ))}
      </HoverTracker>

      <div className="flex justify-center">
        <Link href="/blog">
          <Button variant="outline" size="lg">
            See all blogs
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default RecentBlogs
