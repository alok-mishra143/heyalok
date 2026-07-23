export type ImageType = "webp" | "png" | "jpg" | "jpeg" | "avif"
export type BookStatus = "reading" | "read" | "list"

export interface Book {
  title: string
  author?: string
  image: string
  type: ImageType
  url: string
  status: BookStatus
}

export const BOOKS: Array<Book> = [
  {
    title: "Bhagavad Gita",
    author: "Vyasa",
    image: "Bhagwatgeeta",
    type: "webp",
    url: "/books/Bhagwatgeeta.webp",
    status: "reading",
  },
  {
    title: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    image: "how-to-win-friends-and-influence",
    type: "webp",
    url: "/books/how-to-win-friends-and-influence.webp",
    status: "read",
  },
  {
    title: "Ikigai",
    author: "Héctor García & Francesc Miralles",
    image: "ikigai",
    type: "webp",
    url: "/books/ikigai.webp",
    status: "read",
  },
  {
    title: "Inside Chanakya's Mind",
    author: "Radhakrishnan Pillai",
    image: "inside_chanakya_mind",
    type: "webp",
    url: "/books/inside_chanakya_mind.webp",
    status: "read",
  },
  {
    title: "Raj Vidya",
    author: "A.C. Bhaktivedanta Swami",
    image: "rajvidya",
    type: "webp",
    url: "/books/rajvidya.webp",
    status: "read",
  },
  {
    title: "Swami Vivekananda",
    author: "Swami Nikhilananda",
    image: "Swami-Vivekananda-2",
    type: "webp",
    url: "/books/Swami-Vivekananda-2.webp",
    status: "read",
  },
  {
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    image: "think-grow-rich-fingerprint",
    type: "webp",
    url: "/books/think-grow-rich-fingerprint.webp",
    status: "read",
  },
  {
    title: "Think Like a Monk",
    author: "Jay Shetty",
    image: "Think-like-a-monk-1",
    type: "webp",
    url: "/books/Think-like-a-monk-1.webp",
    status: "read",
  },
]
