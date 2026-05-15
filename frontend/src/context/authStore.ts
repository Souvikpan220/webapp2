import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getDeviceId } from "../utils/device";
import type { AuthState } from "../types";

type Store = {
  auth: AuthState;
  setEmail: (email: string) => void;
  completeOnboarding: (data: Pick<AuthState, "discordUsername" | "tiktokUrl">) => void;
  logout: () => void;
};

const emptyAuth = (): AuthState => ({ email: "", discordUsername: "", tiktokUrl: "", deviceId: getDeviceId() });

export const useAuthStore = create<Store>()(
  persist(
    (set) => ({
      auth: emptyAuth(),
      setEmail: (email) => set((state) => ({ auth: { ...state.auth, email } })),
      completeOnboarding: (data) => set((state) => ({ auth: { ...state.auth, ...data } })),
      logout: () => set({ auth: emptyAuth() })
    }),
    { name: "kaddu_auth_v1" }
  )
);
