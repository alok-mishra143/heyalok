import { create } from "zustand"

interface ExpandState {
  isExpanded: boolean
  setIsExpanded: (value: boolean) => void
}

export const useExpandStore = create<ExpandState>((set) => ({
  isExpanded: false,
  setIsExpanded: (value) => set({ isExpanded: value }),
}))
