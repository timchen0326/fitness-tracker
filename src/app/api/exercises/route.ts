import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/database';

type ExerciseInsert = Database['public']['Tables']['exercises']['Insert'];

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data } = await supabase
      .from('exercises')
      .select('*')
      .eq('user_id', session.user.id)
      .order('exercise_time', { ascending: false });

    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching exercises:', err);
    return NextResponse.json({ message: 'Error fetching exercises' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exercise: ExerciseInsert = await request.json();
    exercise.user_id = session.user.id;
    
    const { data } = await supabase
      .from('exercises')
      .insert([exercise])
      .select()
      .single();

    return NextResponse.json(data);
  } catch (err) {
    console.error('Error creating exercise:', err);
    return NextResponse.json({ message: 'Error creating exercise' }, { status: 500 });
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
        { error: 'Exercise ID is required' },
        { status: 400 }
      );
    }

    const { data } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    return NextResponse.json(data);
  } catch (err) {
    console.error('Error deleting exercise:', err);
    return NextResponse.json({ message: 'Error deleting exercise' }, { status: 500 });
  }
} 