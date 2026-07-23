import { create } from "zustand"

interface DialogState {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export const useDialogStore = create<DialogState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
