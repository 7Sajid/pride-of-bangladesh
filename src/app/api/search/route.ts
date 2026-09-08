import { NextRequest, NextResponse } from 'next/server';
import { ACHIEVERS } from '@/lib/data/seed';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const category = searchParams.get('category') || '';

  if (!query && !category) {
    return NextResponse.json({ results: ACHIEVERS, total: ACHIEVERS.length });
  }

  let results = ACHIEVERS;

  if (category) {
    results = results.filter((a) => a.category === category);
  }

  if (query && query.length >= 2) {
    results = results.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.title.toLowerCase().includes(query) ||
        a.country.toLowerCase().includes(query) ||
        a.profession.toLowerCase().includes(query) ||
        a.tags.some((t) => t.toLowerCase().includes(query)) ||
        a.institutions.some((i) => i.name.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({
    results,
    total: results.length,
    query,
    category: category || null,
  });
}
