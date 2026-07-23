export interface Project {
  title: string
  subtitle: string
  image: string
  tags: string[]
  github: string
  live: string
  stars?: number
  forks?: number
  language?: { name: string; color: string } | null
}
