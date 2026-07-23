import { fetchAllBlogData } from "@/lib/fetch-blog-data"
import { BlogHydrator } from "./BlogHydrator"
import { performance } from "node:perf_hooks";

export async function BlogDataLoader() {

  const blogData = await fetchAllBlogData();

  return <BlogHydrator data={blogData} />
}
