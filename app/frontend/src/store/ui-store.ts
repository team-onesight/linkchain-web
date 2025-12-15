import { create } from 'zustand';

interface UiState {
  isInputFocused: boolean;
  setInputFocused: () => void;
  setInputBlurred: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isInputFocused: false,
  setInputFocused: () => set({ isInputFocused: true }),
  setInputBlurred: () => set({ isInputFocused: false }),
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
}));
