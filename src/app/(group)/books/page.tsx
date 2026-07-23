import type { Metadata } from "next"
import { BooksContent } from "@/components/Books/BooksContent"
import Line from "@/components/asserts/arrows/Line"

export const metadata: Metadata = {
  title: "Books",
  description:
    "Books Alok Mishra is reading, has read, and has queued for later.",
  alternates: {
    canonical: "/books",
  },
  openGraph: {
    images: [{ url: "/og/books.png", width: 1200, height: 630, alt: "Books by Alok Mishra" }],
  },
  twitter: {
    images: ["/og/books.png"],
  },
}

const BooksPage = () => {
  return (
    <section className="mx-auto mt-10 w-full phone:mt-0">
      <div className="flex flex-col justify-start gap-5">
        <h1 className="text-5xl font-bold">Books</h1>
        <Line className="h-auto w-full" strokWidth={0.5} />
      </div>

      <BooksContent />
    </section>
  )
}

export default BooksPage
