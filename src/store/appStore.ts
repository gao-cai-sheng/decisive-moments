import { create } from "zustand";
import type { Argument, Philosopher, PhilosopherIndexEntry, Relationship, RelationshipType, Theme, Work } from "../data/schemas";
import type { StarMapFilters } from "../domain/filters/starFilters";

type Quality = "low" | "high";

type AppState = {
  loaded: boolean;
  loadError: string | null;
  philosophers: PhilosopherIndexEntry[];
  argumentsIndex: Argument[];
  themes: Theme[];
  relationships: Relationship[];
  works: Work[];
  selectedPhilosopherId: string | null;
  selectedPhilosopher: Philosopher | null;
  selectedThoughtProblemId: string | null;
  selectedThoughtClaimId: string | null;
  searchQuery: string;
  quality: Quality;
  filters: StarMapFilters;
  collectionsOpen: boolean;
  settingsOpen: boolean;
  setBootstrapData(input: {
    philosophers: PhilosopherIndexEntry[];
    argumentsIndex: Argument[];
    themes: Theme[];
    relationships: Relationship[];
    works: Work[];
  }): void;
  setLoadError(message: string): void;
  selectPhilosopher(id: string | null): void;
  selectThoughtProblem(id: string | null): void;
  selectThoughtClaim(id: string | null): void;
  setSelectedPhilosopher(philosopher: Philosopher | null): void;
  setSearchQuery(query: string): void;
  setQuality(quality: Quality): void;
  setFilter(name: keyof Omit<StarMapFilters, "relationshipTypes">, value: string): void;
  toggleRelationshipType(type: RelationshipType): void;
  clearFilters(): void;
  toggleCollections(): void;
  toggleSettings(): void;
};

export const useAppStore = create<AppState>((set) => ({
  loaded: false,
  loadError: null,
  philosophers: [],
  argumentsIndex: [],
  themes: [],
  relationships: [],
  works: [],
  selectedPhilosopherId: null,
  selectedPhilosopher: null,
  selectedThoughtProblemId: null,
  selectedThoughtClaimId: null,
  searchQuery: "",
  quality: "high",
  filters: { relationshipTypes: [] },
  collectionsOpen: false,
  settingsOpen: false,
  setBootstrapData: (input) => set({ ...input, loaded: true, loadError: null }),
  setLoadError: (message) => set({ loadError: message, loaded: false }),
  selectPhilosopher: (id) =>
    set({ selectedPhilosopherId: id, selectedThoughtProblemId: null, selectedThoughtClaimId: null }),
  selectThoughtProblem: (id) => set({ selectedThoughtProblemId: id, selectedThoughtClaimId: null }),
  selectThoughtClaim: (id) => set({ selectedThoughtClaimId: id }),
  setSelectedPhilosopher: (philosopher) => set({ selectedPhilosopher: philosopher }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setQuality: (quality) => set({ quality }),
  setFilter: (name, value) =>
    set((state) => {
      const next = { ...state.filters };
      if (value) next[name] = value;
      else delete next[name];
      return { filters: next };
    }),
  toggleRelationshipType: (type) =>
    set((state) => {
      const selected = new Set(state.filters.relationshipTypes);
      if (selected.has(type)) selected.delete(type);
      else selected.add(type);
      return { filters: { ...state.filters, relationshipTypes: [...selected] } };
    }),
  clearFilters: () => set({ filters: { relationshipTypes: [] } }),
  toggleCollections: () => set((state) => ({ collectionsOpen: !state.collectionsOpen })),
  toggleSettings: () => set((state) => ({ settingsOpen: !state.settingsOpen })),
}));

// DEV 调试钩子：profiling 经 window.__appStore 脚本化驱动选中/取消等交互
if (import.meta.env.DEV && typeof window !== "undefined") {
  (window as unknown as { __appStore?: typeof useAppStore }).__appStore = useAppStore;
}
