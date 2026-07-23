import type { Project } from "@/data/Project"
import { getTagBg, getTagHover } from "@/data/project-ui"
import { HoverTracker } from "@/components/ui/hover-tracker"
import {
  ExternalLink,
  GitBranch,
  ArrowUpRight,
  Star,
  GitFork,
} from "lucide-react"

const palettes = [
  { from: "from-indigo-900", via: "via-indigo-700", to: "to-indigo-500" },
  { from: "from-emerald-900", via: "via-emerald-700", to: "to-emerald-500" },
  { from: "from-rose-900", via: "via-rose-700", to: "to-rose-500" },
  { from: "from-amber-900", via: "via-amber-700", to: "to-amber-500" },
  { from: "from-cyan-900", via: "via-cyan-700", to: "to-cyan-500" },
  { from: "from-violet-900", via: "via-violet-700", to: "to-violet-500" },
]

function pickPalette(title: string) {
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = (hash * 31 + title.charCodeAt(i)) | 0
  }
  return palettes[Math.abs(hash) % palettes.length]
}

function ProjectCard({
  project,
  featured,
}: {
  project: Project
  featured?: boolean
}) {
  const p = pickPalette(project.title)
  const hasLive = project.live && project.live !== "#"

  return (
    <article
      className="group relative flex h-[360px] w-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
      data-hover="card-element"
    >
      <div
        className={`relative flex-shrink-0 overflow-hidden bg-gradient-to-br ${p.from} ${p.via} ${p.to} ${featured ? "h-56" : "h-44"}`}
      >
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.06]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id={`pg-${project.title.replace(/\s/g, "")}`}
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="12" cy="12" r="0.8" fill="white" opacity="0.8" />
              <circle cx="0" cy="0" r="0.35" fill="white" opacity="0.4" />
              <circle cx="24" cy="0" r="0.35" fill="white" opacity="0.4" />
              <circle cx="0" cy="24" r="0.35" fill="white" opacity="0.4" />
              <circle cx="24" cy="24" r="0.35" fill="white" opacity="0.4" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#pg-${project.title.replace(/\s/g, "")})`}
          />
        </svg>

        <div className="absolute inset-0 flex items-end justify-end p-6">
          <span className="text-[9rem] leading-none font-black text-white/5 select-none">
            {project.title.charAt(0)}
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-end p-5">
          <h3 className="font-pixel text-lg tracking-tight text-foreground">
            {project.title}
          </h3>
          <p
            className={`mt-1.5 text-sm leading-relaxed text-muted-foreground ${featured ? "line-clamp-3" : "line-clamp-2"}`}
          >
            {project.subtitle}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-4 p-5 pt-4">
        <HoverTracker hoverAttr="chip">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                data-hover="chip"
                data-hover-bg-class={getTagBg(tag)}
                className={`cursor-default rounded-md px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-all duration-300 ${getTagHover(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </HoverTracker>

        {(project.stars != null ||
          project.forks != null ||
          project.language) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
            {project.stars != null && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Star
                  size={12}
                  className="fill-amber-500/30 text-amber-500/60"
                />
                {project.stars}
              </span>
            )}
            {project.forks != null && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <GitFork size={12} />
                {project.forks}
              </span>
            )}
            {project.language && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="h-2 w-2 rounded-full ring-1 ring-black/10 ring-inset dark:ring-white/10"
                  style={{ backgroundColor: project.language.color }}
                />
                {project.language.name}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center gap-4 pt-1">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="group/link inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-all hover:text-foreground"
          >
            <GitBranch size={13} />
            <span>Source</span>
            <ArrowUpRight
              size={10}
              className="translate-x-0.5 -translate-y-0.5 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:translate-y-0 group-hover/link:opacity-100"
            />
          </a>
          {hasLive && (
            <>
              <span className="text-muted-foreground/20" aria-hidden>
                /
              </span>
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="group/link inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-all hover:text-foreground"
              >
                <ExternalLink size={13} />
                <span>Live</span>
                <ArrowUpRight
                  size={10}
                  className="translate-x-0.5 -translate-y-0.5 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:translate-y-0 group-hover/link:opacity-100"
                />
              </a>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProjectCard
