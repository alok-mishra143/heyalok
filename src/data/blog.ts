export type BlogTag = {
  label: string
}

export interface BlogPost {
  title: string
  subtitle: string
  date: string
  slug: string
  keywords: Array<BlogTag>
  link: string
}
