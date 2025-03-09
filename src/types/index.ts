export interface HousePlan {
  id: string;
  title: string;
  style: string;
  bedrooms: number;
  bathrooms: number;
  floorArea: number;
  floors: number;
  garages: number;
  hasPool: boolean;
  estimatedBudget: number;
  price: number;
  description: string;
  images: string[];
  plans2D: string[];
  model3D?: string;
  created_at: string;
}

export interface AdditionalService {
  id: string;
  name: string;
  price: number;
  description: string;
  isDefault: boolean;
}

export type UserRole = 'visitor' | 'professional' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  favorites: string[];
  created_at: string;
}

export interface SearchFilters {
  style?: string;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minFloorArea?: number;
  maxFloorArea?: number;
  floors?: number;
  garages?: number;
  hasPool?: boolean;
  minBudget?: number;
  maxBudget?: number;
  minPrice?: number;
  maxPrice?: number;
}