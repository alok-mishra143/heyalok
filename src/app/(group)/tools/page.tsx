import type { Metadata } from "next"
import Line from "@/components/asserts/arrows/Line"
import { ToolsGrid } from "@/components/Tools/ToolsGrid"

export const metadata: Metadata = {
  title: "Tools",
  description: "The tools, apps, and services Alok Mishra uses daily — editors, AI, design, and more.",
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    images: [{ url: "/og/tools.png", width: 1200, height: 630, alt: "Tools by Alok Mishra" }],
  },
  twitter: {
    images: ["/og/tools.png"],
  },
}

const ToolsPage = () => {
  return (
    <section className="mx-auto mt-10 w-full phone:mt-0">
      <div className="flex flex-col justify-start gap-5">
        <h1 className="text-5xl font-bold">Tools</h1>
        <Line className="h-auto w-full" strokWidth={0.5} />
      </div>

      <ToolsGrid />
    </section>
  )
}

export default ToolsPage
