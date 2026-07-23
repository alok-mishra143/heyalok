"use client"

import {
  TooltipProvider as TooltipProviderPrimitive,
  type TooltipProviderProps,
} from "@/components/animate-ui/primitives/animate/tooltip"

function TooltipProvider({ openDelay = 0, ...props }: TooltipProviderProps) {
  return <TooltipProviderPrimitive openDelay={openDelay} {...props} />
}

export { TooltipProvider, type TooltipProviderProps }
