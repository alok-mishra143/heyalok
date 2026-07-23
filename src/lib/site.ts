export const siteConfig = {
  name: "Alok Mishra",
  title: "Alok Mishra | Full-Stack Developer",
  description:
    "Full-stack developer focused on backend architecture, system design, and building scalable applications. DSA enthusiast. Builds AI workflows and automation tools.",
  descriptionLong:
    "Alok Mishra (zerion0) is a full-stack developer from Surat, India, focused on backend architecture, system design, and building scalable production applications. He has experience maintaining systems at scale, performance optimization, and activity-tracking architecture. He solves competitive programming problems (DSA) as a regular habit and builds AI workflows and automation tools. Explore blogs about software engineering, design, and development.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zerion0.site",
  handle: "@zerion0",
  location: "Surat, Gujarat, India",
  keywords: [
    "Alok Mishra",
    "zerion0",
    "full-stack developer",
    "software engineer",
    "backend developer",
    "system design",
    "TypeScript",
    "Next.js",
    "Node.js",
    "Go",
    "PostgreSQL",
    "Docker",
    "Cloudflare Workers",
    "AI workflows",
    "DSA",
    "Surat developer",
  ],
  social: {
    twitter: "@zerion0",
    github: "#",
    medium: "@zerion0",
    instagram: "itszerion",
    telegram: "heyzerion",
    peerlist: "zerion",
  },
}

export const siteUrl = new URL(siteConfig.url)
