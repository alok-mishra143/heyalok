import type { PersistStorage, StorageValue } from "zustand/middleware"
import { getPersist, setPersist, removePersist } from "./cookie-storage"

export function createEncryptedStorage<T>(): PersistStorage<T> {
  return {
    getItem: async (name) => {
      try {
        const raw = await getPersist<StorageValue<T>>(name)
        return raw ?? null
      } catch {
        return null
      }
    },
    setItem: async (name, value) => {
      await setPersist(name, value)
    },
    removeItem: async (name) => {
      await removePersist(name)
    },
  }
}
