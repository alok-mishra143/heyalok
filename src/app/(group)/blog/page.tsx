import type { Metadata } from "next"
import Line from "@/components/asserts/arrows/Line"
import { BlogList } from "@/components/Blog/BlogList"
import { fetchAllBlogData } from "@/lib/fetch-blog-data"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles by Alok Mishra about full-stack development, design, authentication, backend systems, and web performance.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    images: [{ url: "/og/blog.png", width: 1200, height: 630, alt: "Alok Mishra's Blog" }],
  },
  twitter: {
    images: ["/og/blog.png"],
  },
}

const page = async () => {
  let posts = null
  try {
    posts = await fetchAllBlogData()
  } catch {
    // Data fetching is optional — falls back to client-side
  }

  return (
    <div className="mt-10 h-full w-full phone:mt-0">
      <div className="flex flex-col justify-start gap-5">
        <h1 className="text-5xl font-bold">Blog</h1>
        <Line className="h-auto w-full" strokWidth={0.5} />
      </div>

      <div className="mt-8 relative">
        <BlogList posts={posts ?? undefined} />
      </div>
    </div>
  )
}

export default page
