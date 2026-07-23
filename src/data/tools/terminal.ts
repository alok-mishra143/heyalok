import type { ToolCategory } from "../tools"

export const terminal: ToolCategory = {
  name: "Terminal",
  span: "half",
  items: [
    {
      name: "Terminal",
      description: "Default macOS terminal",
      href: "file:///System/Applications/Utilities/Terminal.app",
      icon: {
        light: "/icon/tool/terminal.svg",
        dark: "/icon/tool/terminal_dark.svg",
      },
    },
  ],
}
