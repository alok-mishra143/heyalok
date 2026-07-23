import { BlogPost } from "@/data/blog"
import { BlogTags } from "./BlogTags"


const BlogCardList = ({ post }: { post: BlogPost }) => {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-transparent transition-all duration-500 hover:-translate-y-1" data-hover="card-element">
      <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-2 p-4 sm:p-5">
        <p className="text-xs text-muted-foreground">{post.date}</p>

        <div className="flex items-center justify-between gap-2">
          <h2 className="line-clamp-1 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-foreground/80">
            {post.title}
          </h2>
          <p className="shrink-0 text-sm font-medium text-primary">
            Read article{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </p>
        </div>



       <BlogTags tags={post.keywords} />

      </div>
    </article>
  )
}

export default BlogCardList
