import type { Metadata } from "next"
import Line from "@/components/asserts/arrows/Line"
import { ProjectPageContent } from "./ProjectPageContent"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects built by Alok Mishra — full-stack applications, AI agents, design systems, and developer tools.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    images: [
      { url: "/og/projects.png", width: 1200, height: 630, alt: "Alok Mishra's Projects" },
    ],
  },
  twitter: {
    images: ["/og/projects.png"],
  },
}

const page = () => {
  return (
    <div className="mt-10 h-full w-full phone:mt-0">
      <div className="flex flex-col justify-start gap-5">
        <h1 className="text-5xl font-bold">Projects</h1>
        <Line className="h-auto w-full" strokWidth={0.5} />
      </div>

      <div className="mt-8 relative">
        <ProjectPageContent />
      </div>
    </div>
  )
}

export default page
