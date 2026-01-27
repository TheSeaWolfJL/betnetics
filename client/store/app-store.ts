import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { UserProfileType } from '@/types';

export type AppStateType = {
  isAuth: boolean;
  isAppError: boolean;
  user: UserProfileType | null;
};

export type AppActions = {
  setAuth: (value: boolean) => void;
  setAppError: () => void;
  setUser: (user: UserProfileType | null) => void;
};

// export type CounterStore = CounterState & CounterActions;
export type AppStore = AppActions & AppStateType;
export const initAppStore = (): AppStateType => {
  return { isAppError: false, isAuth: false, user: null };
};
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      isAppError: false,
      isAuth: false,
      user: null,
      setAuth: (value: boolean) => {
        return set({ isAuth: value });
      },
      setAppError: () =>
        set({ isAppError: (get().isAppError = !get().isAppError) }),
      setUser: (user: UserProfileType | null) => {
        return set({ user });
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
