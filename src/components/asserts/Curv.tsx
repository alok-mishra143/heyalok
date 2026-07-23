import React from "react"
import { cn } from "@/lib/utils"

type CurvProps = {
  className?: string
}

const Curv = ({ className }: CurvProps) => {
  return (
    <svg
      width="400"
      height="44"
      viewBox="0 0 400 44"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-background/90", className)}
    >
      <g clipPath="url(#clip0_2006_377)">
        <path
          d="M400 0H1.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M400 0V53"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M-0.5 0C6.16667 0 12.8333 3.33333 19.5 10L43.5 34C50.1667 40.6667 56.8333 44 63.5 44H389.5C396.167 44 399.5 47.3333 399.5 54V0H-0.5Z"
          fill="currentColor"
        />
        <path
          d="M0 0C6.66667 0 13.3333 3.33333 20 10L44 34C50.6667 40.6667 57.3333 44 64 44H390C396.667 44 400 47.3333 400 54V64"
          stroke="currentColor"
        />
      </g>

      <defs>
        <clipPath id="clip0_2006_377">
          <rect width="400" height="44" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default Curv
