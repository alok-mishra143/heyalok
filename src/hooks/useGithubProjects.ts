"use client"

import { useQuery } from "@tanstack/react-query"
import type { PinnedRepo } from "@/app/api/github/projects/route"

type TransformedProject = {
  title: string
  subtitle: string | null
  github: string
  stars: number
  forks: number
  language: { name: string; color: string } | null
  tags: string[]
  live: string | null
  image: string | null
}

async function fetchPinnedRepos(): Promise<TransformedProject[]> {
  const res = await fetch("/api/github/projects")
  if (!res.ok) throw new Error("Failed to fetch pinned repos")
  const repos: PinnedRepo[] = await res.json()

  return repos.map((repo) => ({
    title: repo.name,
    subtitle: repo.description,
    github: repo.url,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    language: repo.primaryLanguage,
    tags: [
      ...(repo.primaryLanguage ? [repo.primaryLanguage.name] : []),
      ...repo.repositoryTopics.nodes.map((n) => n.topic.name),
    ],
    live: repo.homepageUrl,
    image: repo.openGraphImageUrl,
  }))
}

export function useGithubProjects() {
  return useQuery({
    queryKey: ["github-projects"],
    queryFn: fetchPinnedRepos,
    staleTime: 1000 * 60 * 60,
    retry: 2,
  })
}
