import type { Metadata } from 'next';
import HallOfFameClient from './HallOfFameClient';

export const metadata: Metadata = {
  title: 'Hall of Fame — Pride of BD',
  description:
    'Browse the complete directory of Bangladeshi achievers. Filter by category, search by name, country, or field.',
};

export default function HallOfFamePage() {
  return <HallOfFameClient />;
}
