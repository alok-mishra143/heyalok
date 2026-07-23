import type { ToolCategory } from "../tools"

export const design: ToolCategory = {
  name: "Design",
  span: "half",
  items: [
    {
      name: "Figma",
      description: "Design, prototype, and collaborate",
      href: "https://figma.com",
      icon: "/icon/tool/figma.svg",
    },
    {
      name: "Excalidraw",
      description: "Whiteboard for quick diagrams",
      href: "https://excalidraw.com",
      icon: "/icon/tool/excalidraw.svg",
    },
  ],
}
