"use client"

import { useCallback, useState } from "react"
import * as motion from "motion/react-client"
import { Copy, Check, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useDialogStore } from "@/store/dialog-store"
import { useSoundEffect } from "@/hooks/useSoundEffect"
import ItemElement from "./ItemElement"

type AskAiProps = {
  onNavigate?: () => void
}

const keywords = [
  "llm.txt",
  "a llm compatible txt form to chat with them",
  "copy llm.txt",
  "see llm.txt",
  "agent",
]

const AskAi = ({ onNavigate }: AskAiProps) => {
  const searchQuery = useDialogStore((s) => s.searchQuery)
  const { play } = useSoundEffect("clink")

  const sectionTitle = "Agent compatible"
  const sectionMatch =
    !searchQuery ||
    sectionTitle.toLowerCase().includes(searchQuery.toLowerCase())

  const matchesSearch =
    sectionMatch ||
    keywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()))

  const [showCheck, setShowCheck] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      const res = await fetch("/llm.txt")
      const text = await res.text()
      await navigator.clipboard.writeText(text)
      setShowCheck(true)
      setTimeout(() => setShowCheck(false), 2000)
      play({ vol: 0.5 })
      toast.success("Copied to clipboard")
      onNavigate?.()
    } catch {
      toast.error("Failed to copy")
    }
  }, [])

  if (!matchesSearch) return null

  return (
    <nav aria-label="Ask AI" className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle className="font-pixel text-sm leading-none font-extrabold text-primary">
          Agent compatible
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col">
        <ItemElement
          iconSlot={
            <motion.div layout className="relative size-[18px]">
              <motion.div
                animate={{
                  scale: showCheck ? 1 : 0,
                  opacity: showCheck ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <Check size={18} className="text-green-500" />
              </motion.div>
              <motion.div
                animate={{
                  scale: showCheck ? 0 : 1,
                  opacity: showCheck ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <Copy size={18} />
              </motion.div>
            </motion.div>
          }
          label="Copy llm.txt"
          subTitle="a llm compatible txt form to chat with them"
          onClick={handleCopy}
        />

        <ItemElement
          iconSlot={<ExternalLink size={18} />}
          label="See llm.txt"
          subTitle="View the llm.txt file in a new tab"
          href="/llm.txt"
          target="_blank"
          onClick={() => onNavigate?.()}
        />
      </div>
    </nav>
  )
}

export default AskAi
