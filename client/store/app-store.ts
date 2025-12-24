import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AppStateType = {
  isAuth: boolean;
  isAppError: boolean;
};

export type AppActions = {
  setAuth: (value: boolean) => void;
  setAppError: () => void;
};

// export type CounterStore = CounterState & CounterActions;
export type AppStore = AppActions & AppStateType;
export const initAppStore = (): AppStateType => {
  return { isAppError: false, isAuth: false };
};
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      isAppError: false,
      isAuth: false,
      setAuth: (value: boolean) => {
        return set({ isAuth: value });
      },
      setAppError: () =>
        set({ isAppError: (get().isAppError = !get().isAppError) }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
