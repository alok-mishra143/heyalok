import type { BlogPost } from "@/data/blog"
import Link from "next/link"
import CurvArrow1 from "../asserts/arrows/CurvArrow1"
import BlogCardList from "./BlogCardList"
import { HoverTracker } from "@/components/ui/hover-tracker"

type PostData = BlogPost & { content: string }

function RelatedBlogPosts({ relatedPosts }: { relatedPosts: PostData[] }) {
  if (relatedPosts.length === 0) return null

  return (
    <section className="relative mt-12 border-t pt-8">
      <div className="pointer-events-none absolute top-8 -left-38 z-50 hidden lg:block">
        <CurvArrow1
          ClassName="h-auto w-28 -rotate-180 -scale-y-100 text-primary/40"
          strokeWidth={2.5}
        />
        <span className="flex -translate-x-32 -translate-y-10 text-xs leading-tight text-primary/70">
          you may like that also
        </span>
      </div>
      <h2 className="mb-5 text-lg font-semibold tracking-tight">
        Read related blogs
      </h2>
      <HoverTracker
        className="flex flex-col gap-4"
      >
        {relatedPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <BlogCardList post={post} />
          </Link>
        ))}
      </HoverTracker>
    </section>
  )
}

export default RelatedBlogPosts
