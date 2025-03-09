import { create } from 'zustand';
import { HousePlan, SearchFilters, User } from '../types';

interface Store {
  user: User | null;
  setUser: (user: User | null) => void;
  housePlans: HousePlan[];
  setHousePlans: (plans: HousePlan[]) => void;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<Store>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  housePlans: [],
  setHousePlans: (plans) => set({ housePlans: plans }),
  filters: {},
  setFilters: (filters) => set({ filters }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));