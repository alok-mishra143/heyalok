import { ArrowLeft } from "lucide-react"
import Link from "next/link"

function BackToBlog({ className }: { className?: string }) {
  return (
    <Link
      href="/blog"
      className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-sm text-muted-foreground transition-all hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/30 dark:hover:text-green-400 ${className ?? ""}`}
    >
      <ArrowLeft size={16} />
      Back to blog
    </Link>
  )
}

export default BackToBlog
