"use client"

import ProjectCard from "@/components/Projects/ProjectCard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useGithubProjects } from "@/hooks/useGithubProjects"

const RecentProjects = () => {
  const { data } = useGithubProjects()
  const recent = data?.slice(0, 2) ?? []

  if (recent.length === 0) return null

  return (
    <div className="relative z-0 space-y-6">
      <div className="font-pixel">
        <h2 className="text-2xl">Recent Projects</h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
        {recent.map((project) => (
          <ProjectCard
            key={project.title}
            project={{
              title: project.title,
              subtitle: project.subtitle ?? "",
              image: project.image ?? "",
              tags: project.tags,
              github: project.github,
              live: project.live ?? "#",
              stars: project.stars,
              forks: project.forks,
              language: project.language,
            }}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <Link href="/projects">
          <Button variant="outline" size="lg">
            See all projects
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default RecentProjects
