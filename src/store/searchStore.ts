import { create } from "zustand";

interface SearchState {
  keyword: string;
  setKeyword: (keyword: string) => void;
  resetSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  keyword: "",
  setKeyword: (keyword: string) => set({ keyword }),
  resetSearch: () => set({ keyword: "" }),
}));
