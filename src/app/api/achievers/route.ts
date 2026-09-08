import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Achiever } from '@/types/achiever';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase
    .from('custom_achievers')
    .select('*')
    .eq('isDeleted', false);

  if (error) {
    console.error('Error reading custom achievers:', error);
    return NextResponse.json({ success: false, achievers: [] });
  }

  return NextResponse.json({ success: true, achievers: data || [] });
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

    const { data, error } = await supabase
      .from('custom_achievers')
      .upsert(newAchiever)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, achiever: data });
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

    const { error } = await supabase
      .from('custom_achievers')
      .update({ isDeleted: true })
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Error deleting achiever:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete achiever' },
      { status: 500 }
    );
  }
}
