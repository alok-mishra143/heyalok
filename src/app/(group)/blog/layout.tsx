import BlogQuoteDisplay from "@/components/Blog/BlogQuoteDisplay"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-8 relative">
      <div className="min-w-0 flex-1">{children}</div>
      <aside className=" fixed hidden w-[180px] shrink-0 pt-10 min-[1680px]:block right-80 top-80">
        <BlogQuoteDisplay />
      </aside>
    </div>
  )
}
