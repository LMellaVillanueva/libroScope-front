import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

interface UserStore {
    user: User | null
    logIn: (newUser: User) => void
    logOut: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      logIn: (newUser: User) => set({ user: newUser }),
      logOut: () => set({ user: null }),
    }),
    {
      name: "user-storage", 
    }
  )
)