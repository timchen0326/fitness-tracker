import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase.from('test').select('*').limit(1);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'Connected to Supabase successfully!' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to connect to Supabase' },
      { status: 500 }
    );
  }
} 