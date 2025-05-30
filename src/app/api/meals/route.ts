import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/database';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', session.user.id)
      .order('meal_time', { ascending: false });

    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching meals:', err);
    return NextResponse.json({ message: 'Error fetching meals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mealData = await request.json();
    mealData.user_id = session.user.id;

    const { data } = await supabase
      .from('meals')
      .insert([mealData])
      .select()
      .single();

    return NextResponse.json(data);
  } catch (err) {
    console.error('Error creating meal:', err);
    return NextResponse.json({ message: 'Error creating meal' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Meal ID is required' },
        { status: 400 }
      );
    }

    const { data } = await supabase
      .from('meals')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    return NextResponse.json(data);
  } catch (err) {
    console.error('Error deleting meal:', err);
    return NextResponse.json({ message: 'Error deleting meal' }, { status: 500 });
  }
} 