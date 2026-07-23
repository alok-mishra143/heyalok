"use client"

import type { BlogPost } from "@/data/blog"
import Line from "@/components/asserts/arrows/Line"
import RelatedBlogPosts from "@/components/Blog/RelatedBlogPosts"
import BackToBlog from "@/components/Blog/BackToBlog"
import { Medium } from "@/components/asserts/Social/Medium"
import CurvArrow1 from "@/components/asserts/arrows/CurvArrow1"
import { BlogTags } from "@/components/Blog/BlogTags"
import { Suspense } from "react"
import { BlogContentEnhancer } from "@/components/Blog/BlogContentEnhancer"
import { CustomMarkdown } from "@/components/Custom/CustomMarkdown"
import dynamic from "next/dynamic"

const BlogReadingProgress = dynamic(() =>
  import("@/components/Blog/BlogReadingProgress").then((m) => ({ default: m.BlogReadingProgress })),
  { ssr: false }
)

type PostData = BlogPost & { content: string }

function formatDate(dateStr: string): string {
  const [day, month, year] = dateStr.split(".")
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function BlogPostClient({
  post,
  relatedPosts,
}: {
  post: PostData
  relatedPosts: PostData[]
}) {

  return (
    <div className="mt-10 mb-10 h-full w-full phone:mt-0">
      <div className="flex flex-col justify-start gap-5">
        <BackToBlog />
        <Line className="h-auto w-full" strokWidth={0.5} />
      </div>

      <div className="mx-auto mt-12">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
          <time className="mt-3 block text-sm text-muted-foreground">
            {formatDate(post.date)}
          </time>

          <div className="relative mt-4">
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Medium className="size-3.5" />
              Read on Medium
            </a>

            <div className="pointer-events-none absolute -top-10 -left-25 z-50 hidden text-muted-foreground/40 lg:block">
              <CurvArrow1
                ClassName="h-20 w-20 rotate-180 text-muted-foreground/40"
                strokeWidth={2.5}
              />
              <span className="absolute top-0 -left-55 text-sm leading-tight text-muted-foreground/60">
                you can also support on medium
              </span>
            </div>
          </div>
        </header>

        <CustomMarkdown>{post.content}</CustomMarkdown>

        <Suspense fallback={null}>
          <BlogContentEnhancer />
        </Suspense>

        <div className="mt-8">
          <BlogTags tags={post.keywords} />
        </div>

        <BackToBlog className="mt-16" />

        <RelatedBlogPosts relatedPosts={relatedPosts} />
      </div>

      <BlogReadingProgress />
    </div>
  )
}
