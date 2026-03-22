import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  email: string;
}

interface UserStore {
  user: User | null;
  setUser: (newUser: User | null) => void;
  reset: () => void;
}

export const useAuthStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (newUser) => set({ user: newUser }),
      reset: () => set({ user: null }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);