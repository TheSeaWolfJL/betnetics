import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ProfileStateType = {
  profileId: string;
  //   decks: Array<Deck>;
  //   pagination: PaginationType;
};

export type ProfileActions = {
  setProfileId: (id: string) => void;
  //   setDecks: (decks: Array<Deck>) => void;
  //   setPagination: (pagination: PaginationType) => void;
};

// export type CounterStore = CounterState & CounterActions;
export type ProfileStore = ProfileActions & ProfileStateType;
export const initAppStore = (): any => {
  return {
    profileId: '',
    // posts: [] as Array<Deck>,
    // pagination: {} as PaginationType,
  };
};
export const useProfileStore = create<any>()(
  persist(
    (set, get) => ({
      profile: '',
      //   posts: [] as Array<Post>,
      //   pagination: {} as PaginationType,
      //   // addABear: () => set({ bears: get().bears + 1 }),
      //   setPosts: (decks: Array<Deck>) => {
      //     return set({ decks });
      //   },
      //   setPagination: (pagination: PaginationType) => {
      //     return set({ pagination });
      //   },
    }),
    {
      name: 'posts-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      //   skipHydration: true,
    }
  )
);
