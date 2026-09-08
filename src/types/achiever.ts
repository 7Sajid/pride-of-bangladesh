/* ─── Core Data Types — mirrors Supabase schema ─── */

export type CategorySlug =
  | 'technology'
  | 'science'
  | 'arts'
  | 'sports'
  | 'business'
  | 'humanitarian'
  | 'academia';

export interface Category {
  id: string;
  slug: CategorySlug;
  label: string;
  color: string;       // hex color for 3D ring & UI badge
  icon: string;        // emoji shorthand
  orbitRadius: number;  // distance from center in 3D scene
}

export interface Award {
  title: string;
  year?: number;
  organization?: string;
}

export interface Institution {
  name: string;
  role: string;         // e.g. "Professor", "CEO", "Founder"
  country?: string;
  current: boolean;
}

export interface Achiever {
  id: string;
  slug: string;
  name: string;
  title: string;        // one-liner, e.g. "Nobel Laureate in Economics"
  bio: string;
  photoUrl: string;     // placeholder path or URL
  country: string;      // country of primary activity
  countryFlag: string;  // emoji flag
  nationality: string;
  category: CategorySlug;
  profession: string;
  awards: Award[];
  institutions: Institution[];
  tags: string[];
  featured: boolean;
  // 3D positioning (computed from category orbit)
  orbitAngle?: number;
  isDeleted?: boolean;
}

export type ConnectionType =
  | 'same_field'
  | 'same_university'
  | 'same_country'
  | 'same_industry'
  | 'collaborated';

export interface AchieverConnection {
  id: string;
  achieverId: string;
  relatedAchieverId: string;
  relationType: ConnectionType;
}

/* ─── UI State Types ─── */

export type DeviceTier = 'high' | 'low' | 'fallback';
export type UIMode = 'atlas' | 'list';
export type ViewMode = 'explore' | 'category' | 'achiever';

export interface SearchResult {
  achiever: Achiever;
  matchField: string;
  score: number;
}

/* ─── Stats ─── */

export interface AtlasStats {
  totalAchievers: number;
  totalCountries: number;
  totalFields: number;
  totalAwards: number;
}
