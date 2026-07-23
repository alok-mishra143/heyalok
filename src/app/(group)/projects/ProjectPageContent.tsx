"use client"

import { ProjectList } from "@/components/Projects/ProjectList"
import { useGithubProjects } from "@/hooks/useGithubProjects"

export function ProjectPageContent() {
  const { data, isLoading } = useGithubProjects()

  if (isLoading || !data) {
    return (
      <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
        Loading projects...
      </div>
    )
  }

  const projects = data.map((gp) => ({
    title: gp.title,
    subtitle: gp.subtitle ?? "",
    image: gp.image ?? "",
    tags: gp.tags,
    github: gp.github,
    live: gp.live ?? "#",
    stars: gp.stars,
    forks: gp.forks,
    language: gp.language,
  }))

  if (projects.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
        No pinned projects found on GitHub.
      </div>
    )
  }

  return <ProjectList projects={projects} />
}
