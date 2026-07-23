"use client"

import { useRef } from "react"
import type { Project } from "@/data/Project"
import ProjectCard from "./ProjectCard"
import { motion, useInView } from "motion/react"

function ProjectCardItem({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-40px" })

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 20, filter: "blur(8px)" }
      }
      exit={{
        opacity: 0,
        scale: 0.95,
        filter: "blur(12px)",
        transition: { duration: 0.25 },
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.07,
        ease: "easeOut",
      }}
    >
      <ProjectCard project={project} />
    </motion.div>
  )
}

export function ProjectList({ projects }: { projects: Project[] }) {
  if (!projects?.length) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      {projects.map((project, index) => (
        <ProjectCardItem key={project.title} project={project} index={index} />
      ))}
    </div>
  )
}
