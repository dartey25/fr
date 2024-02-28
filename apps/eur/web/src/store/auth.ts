import { TUser } from "@/shared-types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type AuthState = {
  user?: TUser;
};

type AuthActions = {
  setUser: (user: TUser) => void;
};

type AuthStore = AuthState & AuthActions;

const useAuth = create<AuthStore>()(
  persist(
    immer((set) => ({
      user: undefined,
      setUser: (user) => {
        set((state) => {
          state.user = { ...state.user, ...user };
        });
      },
    })),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export { useAuth };
export type { AuthStore };
