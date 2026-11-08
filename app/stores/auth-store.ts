import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type AuthState = {
  accessToken: string | null
  hasHydrated: boolean
  setAccessToken: (token: string | null) => void
  setHasHydrated: (value: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      hasHydrated: false,
      setAccessToken: (token) => set({ accessToken: token }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      logout: () => set({ accessToken: null })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
      partialize: (state) => ({
        accessToken: state.accessToken
      })
    }
  )
)
