import type { Metadata } from 'next';
import ContributeClient from './ContributeClient';

export const metadata: Metadata = {
  title: 'Contribute — Nominate a Bangladeshi Achiever',
  description:
    'Know a Bangladeshi achiever who deserves recognition? Submit a nomination to have them featured on the Bangladesh Talent Atlas.',
};

export default function ContributePage() {
  return <ContributeClient />;
}
