import { create } from "zustand"

interface GrindLogState {
  selectedYear: number
  selectedMonth: number
  selectedDay: number
  setSelectedDay: (day: number) => void
  setSelectedMonth: (month: number) => void
  setSelectedYear: (year: number) => void
  goToPrevMonth: () => void
  goToNextMonth: () => void
  goToPrevYear: () => void
  goToNextYear: () => void
  isCurrentMonth: () => boolean
}

export const useGrindLogStore = create<GrindLogState>((set, get) => {
  const now = new Date()

  return {
    selectedYear: now.getFullYear(),
    selectedMonth: now.getMonth(),
    selectedDay: now.getDate(),

    setSelectedDay: (day) => set({ selectedDay: day }),

    setSelectedMonth: (month) =>
      set((state) => {
        const daysInMonth = new Date(state.selectedYear, month + 1, 0).getDate()
        return { selectedMonth: month, selectedDay: Math.min(state.selectedDay, daysInMonth) }
      }),

    setSelectedYear: (year) =>
      set((state) => {
        const daysInMonth = new Date(year, state.selectedMonth + 1, 0).getDate()
        return { selectedYear: year, selectedDay: Math.min(state.selectedDay, daysInMonth) }
      }),

    goToPrevMonth: () =>
      set((state) => {
        const newMonth = state.selectedMonth - 1
        if (newMonth < 0) {
          const year = state.selectedYear - 1
          const daysInMonth = new Date(year, 11 + 1, 0).getDate()
          return {
            selectedMonth: 11,
            selectedYear: year,
            selectedDay: Math.min(state.selectedDay, daysInMonth),
          }
        }
        const daysInMonth = new Date(state.selectedYear, newMonth + 1, 0).getDate()
        return { selectedMonth: newMonth, selectedDay: Math.min(state.selectedDay, daysInMonth) }
      }),

    goToNextMonth: () =>
      set((state) => {
        const newMonth = state.selectedMonth + 1
        if (newMonth > 11) {
          const year = state.selectedYear + 1
          const daysInMonth = new Date(year, 0 + 1, 0).getDate()
          return {
            selectedMonth: 0,
            selectedYear: year,
            selectedDay: Math.min(state.selectedDay, daysInMonth),
          }
        }
        const daysInMonth = new Date(state.selectedYear, newMonth + 1, 0).getDate()
        return { selectedMonth: newMonth, selectedDay: Math.min(state.selectedDay, daysInMonth) }
      }),

    goToPrevYear: () =>
      set((state) => {
        const year = state.selectedYear - 1
        const daysInMonth = new Date(year, state.selectedMonth + 1, 0).getDate()
        return { selectedYear: year, selectedDay: Math.min(state.selectedDay, daysInMonth) }
      }),

    goToNextYear: () =>
      set((state) => {
        const year = state.selectedYear + 1
        const daysInMonth = new Date(year, state.selectedMonth + 1, 0).getDate()
        return { selectedYear: year, selectedDay: Math.min(state.selectedDay, daysInMonth) }
      }),

    isCurrentMonth: () => {
      const now = new Date()
      const { selectedYear, selectedMonth } = get()
      return selectedYear === now.getFullYear() && selectedMonth === now.getMonth()
    },
  }
})
