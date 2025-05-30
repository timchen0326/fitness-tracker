import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/database';

type ExerciseInsert = Database['public']['Tables']['exercises']['Insert'];

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
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
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const exercise: ExerciseInsert = {
      user_id: session.user.id,
      name: body.name,
      type: body.type,
      exercise_category: body.exercise_category,
      exercise_time: body.date,
      // Optional fields based on category
      duration: body.duration || null,
      calories_burned: body.calories_burned || null,
      sets: body.sets || null,
      reps: body.reps || null,
      weight: body.weight || null,
      distance: body.distance || null
    };
    
    const { data, error } = await supabase
      .from('exercises')
      .insert([exercise])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ message: 'Failed to create exercise' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Error creating exercise:', err);
    return NextResponse.json({ message: 'Error creating exercise' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
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

    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting exercise:', err);
    return NextResponse.json({ message: 'Error deleting exercise' }, { status: 500 });
  }
} 