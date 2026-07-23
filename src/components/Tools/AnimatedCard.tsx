"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"

export function AnimatedCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(8px)" }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
