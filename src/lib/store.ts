import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CategorySlug, DeviceTier, UIMode, Achiever } from '@/types/achiever';

interface AtlasState {
  /* ─ Selection ─ */
  selectedAchieverId: string | null;
  selectedCategory: CategorySlug | null;
  hoveredAchieverId: string | null;

  /* ─ Search ─ */
  searchQuery: string;
  searchOpen: boolean;

  /* ─ Device & UI ─ */
  deviceTier: DeviceTier;
  uiMode: UIMode;

  /* ─ Detail panel ─ */
  detailOpen: boolean;

  /* ─ Admin ─ */
  isAdmin: boolean;

  /* ─ Custom Achievers ─ */
  customAchievers: Achiever[];

  /* ─ Actions ─ */
  selectAchiever: (id: string | null) => void;
  selectCategory: (slug: CategorySlug | null) => void;
  hoverAchiever: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleSearch: () => void;
  setDeviceTier: (tier: DeviceTier) => void;
  setUIMode: (mode: UIMode) => void;
  openDetail: (achieverId: string) => void;
  closeDetail: () => void;
  addAchiever: (achiever: Achiever) => void;
  setCustomAchievers: (achievers: Achiever[]) => void;
  removeAchiever: (id: string) => void;
  setAdmin: (isAdmin: boolean) => void;
}

export const useAtlasStore = create<AtlasState>()(
  persist(
    (set) => ({
      /* ─ Initial State ─ */
      selectedAchieverId: null,
      selectedCategory: null,
      hoveredAchieverId: null,
      searchQuery: '',
      searchOpen: false,
      deviceTier: 'high',
      uiMode: 'atlas',
      detailOpen: false,
      customAchievers: [],
      isAdmin: false,

      /* ─ Actions ─ */
      selectAchiever: (id) =>
        set({ selectedAchieverId: id, detailOpen: id !== null }),

      selectCategory: (slug) =>
        set({ selectedCategory: slug }),

      hoverAchiever: (id) =>
        set({ hoveredAchieverId: id }),

      setSearchQuery: (query) =>
        set({ searchQuery: query }),

      toggleSearch: () =>
        set((state) => ({ searchOpen: !state.searchOpen })),

      setDeviceTier: (tier) =>
        set({ deviceTier: tier, uiMode: tier === 'fallback' ? 'list' : 'atlas' }),

      setUIMode: (mode) =>
        set({ uiMode: mode }),

      openDetail: (achieverId) =>
        set({ selectedAchieverId: achieverId, detailOpen: true }),

      closeDetail: () =>
        set({ detailOpen: false, selectedAchieverId: null }),

      addAchiever: (achiever) =>
        set((state) => ({
          customAchievers: [achiever, ...state.customAchievers.filter((a) => a.id !== achiever.id)],
        })),

      setCustomAchievers: (achievers) =>
        set({ customAchievers: achievers }),

      removeAchiever: (id) =>
        set((state) => {
          const existing = state.customAchievers.find(a => a.id === id);
          if (existing) {
            return {
              customAchievers: state.customAchievers.map(a => 
                a.id === id ? { ...a, isDeleted: true } : a
              )
            };
          } else {
            // If it's a seed achiever, we add a dummy deleted record
            return {
              customAchievers: [
                ...state.customAchievers,
                { id, isDeleted: true } as Achiever
              ]
            };
          }
        }),

      setAdmin: (isAdmin) =>
        set({ isAdmin }),
    }),
    {
      name: 'pride-of-bd-atlas-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        customAchievers: state.customAchievers,
      }),
    }
  )
);

