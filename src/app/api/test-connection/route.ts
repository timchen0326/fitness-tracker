import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/database';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    await supabase.from('test').select('count');
    return NextResponse.json({ status: 'Connected to Supabase successfully!' });
  } catch (err) {
    console.error('Database connection error:', err);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
} 