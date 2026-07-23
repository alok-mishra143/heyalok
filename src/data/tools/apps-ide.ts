import type { ToolCategory } from "../tools"

export const appsIde: ToolCategory = {
  name: "Apps & IDE",
  span: "full",
  items: [
    {
      name: "Notion",
      href: "https://notion.so",
      icon: "/icon/tool/notion.svg",
    },
    {
      name: "Zed",
      href: "https://zed.dev",
      icon: {
        light: "/icon/tool/zed-logo.svg",
        dark: "/icon/tool/zed-logo_dark.svg",
      },
    },
    {
      name: "Brave",
      href: "https://brave.com",
      icon: "/icon/tool/brave.svg",
    },
    {
      name: "Cap.so",
      href: "https://cap.so",
      icon: "/icon/tool/capso.svg",
    },
  ],
}
