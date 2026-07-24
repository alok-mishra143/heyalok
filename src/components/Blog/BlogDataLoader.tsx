import { fetchAllBlogData } from "@/lib/fetch-blog-data"
import { BlogHydrator } from "./BlogHydrator"

export async function BlogDataLoader() {
  let blogData: Awaited<ReturnType<typeof fetchAllBlogData>> = []

  try {
    blogData = await fetchAllBlogData()
  } catch (error) {
    console.error("Failed to load blog data:", error)
  }

  return <BlogHydrator data={blogData} />
}
