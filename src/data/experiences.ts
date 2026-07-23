export interface Experience {
  role: string
  company: string
  period: string
  summary: string
  details: string[]
  tags: string[]
}

export const experiences: Experience[] = [
  {
    role: "Software Developer",
    company: "Patoliya Infotech",
    period: "July 2025 – Present",
    summary: "Work as an SDE building and learning new things",
    details: [
      "Refactored a legacy codebase into a monorepo, improving code organization by 30%, increasing scalability, and streamlining collaboration.",
      "Designed and implemented a scalable user activity tracking architecture for monitoring, logging, and analytics.",
      "Built multiple custom animated UI components used across production projects.",
      "Reduced API calls by 70% (from 14M+) by redesigning both frontend and backend activity tracking.",
      "Works on company products, building MCP, Tools, and Agent integrations, serving as Lead Developer",
    ],
    tags: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Turborepo",
      "Redis",
      "Docker",
      "AWS",
    ],
  },
  {
    role: "Software Developer Intern",
    company: "Patoliya Infotech",
    period: "January 2025 – June 2025",
    summary: "Started my career as an SDE in the IT field",
    details: [
      "Redesigned the API architecture, reducing average response time from ~3s to ~500ms through optimized queries and backend refactoring.",
      "Implemented secure role-based dashboard access.",
      "Built scalable employee management with reusable CRUD components and client-side caching.",
      "Fixed critical bugs while improving application performance and maintainability.",
    ],
    tags: ["MongoDB", "Express.js", "React", "Node.js"],
  },
]
