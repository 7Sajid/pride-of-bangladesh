import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Achiever } from '@/types/achiever';

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data', 'custom-achievers.json');

export const dynamic = 'force-dynamic';

function readCustomAchievers(): Achiever[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data) || [];
  } catch (error) {
    console.error('Error reading custom achievers file:', error);
    return [];
  }
}

function writeCustomAchievers(achievers: Achiever[]) {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(achievers, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing custom achievers file:', error);
  }
}

export async function GET() {
  const achievers = readCustomAchievers();
  return NextResponse.json({ success: true, achievers });
}

export async function POST(request: NextRequest) {
  try {
    const newAchiever: Achiever = await request.json();

    if (!newAchiever || !newAchiever.name || !newAchiever.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required achiever fields' },
        { status: 400 }
      );
    }

    const current = readCustomAchievers();
    // Prepend new achiever or update if id matches
    const updated = [newAchiever, ...current.filter((a) => a.id !== newAchiever.id)];
    writeCustomAchievers(updated);

    return NextResponse.json({ success: true, achiever: newAchiever });
  } catch (error: any) {
    console.error('Error saving achiever:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save achiever' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing achiever ID' },
        { status: 400 }
      );
    }

    const current = readCustomAchievers();
    const existing = current.find((a) => a.id === id);
    
    let updated;
    if (existing) {
      updated = current.map((a) => (a.id === id ? { ...a, isDeleted: true } : a));
    } else {
      updated = [...current, { id, isDeleted: true } as Achiever];
    }
    
    writeCustomAchievers(updated);

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Error deleting achiever:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete achiever' },
      { status: 500 }
    );
  }
}
