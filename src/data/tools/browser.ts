import type { ToolCategory } from "../tools"

export const browser: ToolCategory = {
  name: "Browser",
  span: "half",
  items: [
    {
      name: "Brave",
      description: "Privacy-first daily driver",
      href: "https://brave.com",
      icon: "/icon/tool/brave.svg",
    },
    {
      name: "Safari",
      description: "Fruit-themed web browser",
      href: "https://www.apple.com/safari/",
      icon: "/icon/tool/safari.svg",
    },
  ],
}
