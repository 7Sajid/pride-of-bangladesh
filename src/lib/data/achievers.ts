import type { Achiever, CategorySlug } from '@/types/achiever';
import { ACHIEVERS } from './seed';

// Map common country names to emoji flags
const COUNTRY_FLAGS: Record<string, string> = {
  bangladesh: '🇧🇩',
  bd: '🇧🇩',
  'united states': '🇺🇸',
  usa: '🇺🇸',
  us: '🇺🇸',
  'united kingdom': '🇬🇧',
  uk: '🇬🇧',
  canada: '🇨🇦',
  germany: '🇩🇪',
  japan: '🇯🇵',
  australia: '🇦🇺',
  sweden: '🇸🇪',
  switzerland: '🇨🇭',
  france: '🇫🇷',
  india: '🇮🇳',
  malaysia: '🇲🇾',
  singapore: '🇸🇬',
  netherlands: '🇳🇱',
  norway: '🇳🇴',
  denmark: '🇩🇰',
  finland: '🇫🇮',
  china: '🇨🇳',
  uae: '🇦🇪',
  'united arab emirates': '🇦🇪',
  qatar: '🇶🇦',
  saudi: '🇸🇦',
  'saudi arabia': '🇸🇦',
};

export function getCountryFlag(countryName: string): string {
  if (!countryName) return '🇧🇩';
  const clean = countryName.trim().toLowerCase();
  return COUNTRY_FLAGS[clean] || '🇧🇩';
}

/**
 * Merge custom user-submitted achievers (from localStorage / DB) with seed achievers.
 * Custom achievers come first so they are immediately visible.
 */
export function mergeAchievers(customAchievers: Achiever[] = []): Achiever[] {
  const seenIds = new Set<string>();
  const merged: Achiever[] = [];

  for (const a of customAchievers) {
    if (a && a.id && !seenIds.has(a.id)) {
      seenIds.add(a.id);
      if (!a.isDeleted) {
        merged.push(a);
      }
    }
  }

  for (const a of ACHIEVERS) {
    if (!seenIds.has(a.id)) {
      seenIds.add(a.id);
      merged.push(a);
    }
  }

  return merged;
}

export function findAchiever(idOrSlug: string, customAchievers: Achiever[] = []): Achiever | undefined {
  if (!idOrSlug) return undefined;
  const merged = mergeAchievers(customAchievers);
  return merged.find((a) => a.id === idOrSlug || a.slug === idOrSlug);
}
