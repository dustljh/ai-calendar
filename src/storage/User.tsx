import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  //id: number | null DB에서 id를 난수나 date를 활용해 숫자가 곂치지 않게 삽입
  email: string;
  //password: string;
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