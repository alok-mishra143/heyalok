import type { ToolCategory } from "../tools"

export const llm: ToolCategory = {
  name: "Research & Coffee",
  span: "half",
  items: [
    {
      name: "ChatGPT",
      href: "https://chatgpt.com",
      icon: {
        light: "/icon/tool/openai.svg",
        dark: "/icon/tool/openai_dark.svg",
      },
    },
    {
      name: "opencode",
      href: "https://opencode.ai",
      icon: {
        light: "/icon/tool/opencode.svg",
        dark: "/icon/tool/opencode-dark.svg",
      },
    },
    {
      name: "NotebookLM",
      href: "https://notebooklm.google.com",
      icon: {
        light: "/icon/tool/notebooklm-black.svg",
        dark: "/icon/tool/notebooklm-white.svg",
      },
    },
    {
      name: "Claude",
      href: "https://claude.ai",
      icon: {
        light: "/icon/tool/claude-black.svg",
        dark: "/icon/tool/claude-white.svg",
      },
    },
  ],
}
