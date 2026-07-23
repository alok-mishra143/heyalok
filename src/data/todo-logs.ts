export type TodoStatus = "done" | "pending"

export type TodoLog = {
  title: string
  status: TodoStatus
}

export type TodoLogsByDate = Record<string, TodoLog[]>

export const TODO_LOGS: TodoLogsByDate = {
  "15-07-2026": [
    { title: "Review PR #42", status: "done" },
    { title: "Write unit tests for WaveForm", status: "done" },
    { title: "Fix responsive layout on mobile", status: "pending" },
  ],
  "14-07-2026": [
    { title: "Refactor grind log store", status: "done" },
    { title: "Add month picker animations", status: "done" },
  ],
  "13-07-2026": [
    { title: "Set up CI/CD pipeline", status: "done" },
    { title: "Update dependencies", status: "pending" },
    { title: "Write documentation for API", status: "pending" },
  ],
  "12-07-2026": [
    { title: "Design new landing page", status: "done" },
    { title: "Fix dark mode colors", status: "done" },
    { title: "Add search functionality", status: "pending" },
    { title: "Optimize bundle size", status: "pending" },
  ],
  "11-07-2026": [
    { title: "Fix login flow bug", status: "done" },
  ],
  "10-07-2026": [
    { title: "Add dark mode support", status: "done" },
    { title: "Write blog post on React patterns", status: "done" },
    { title: "Upgrade to Next.js 15", status: "done" },
  ],
  "18-08-2025": [
    { title: "Project kickoff meeting", status: "done" },
    { title: "Set up repo structure", status: "done" },
  ],
  "25-08-2025": [
    { title: "Design system review", status: "done" },
  ],
}

const sortedKeys = Object.keys(TODO_LOGS).sort((a, b) => {
  const [dA, mA, yA] = a.split("-").map(Number)
  const [dB, mB, yB] = b.split("-").map(Number)
  return yA - yB || mA - mB || dA - dB
})

const first = sortedKeys[0]
const [_, firstM, firstY] = first.split("-").map(Number)

export const MIN_TODO_YEAR = firstY
export const MIN_TODO_MONTH = firstM - 1
