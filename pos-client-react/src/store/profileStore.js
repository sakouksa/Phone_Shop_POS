import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const profileStore = create(
  persist(
    (set) => ({
      profile: null,
      access_token: null,

      setProfile: (params) => set((pre) => ({ profile: params })),
      setAccessToken: (params) => set((pre) => ({ access_token: params })),
      logout: () => set((pre) => ({ profile: null })),
    }),
    {
      name: "user-profile",
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
