import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

type MealInsert = Database['public']['Tables']['meals']['Insert'];

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createClient();
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 401 }
      );
    }

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Please sign in to access your meals' },
        { status: 401 }
      );
    }

    const { data: meals, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', session.user.id)
      .order('meal_time', { ascending: false });

    if (error) {
      console.error('Error fetching meals:', error);
      return NextResponse.json(
        { error: 'Failed to fetch meals' },
        { status: 500 }
      );
    }

    return NextResponse.json(meals);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createClient();
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 401 }
      );
    }

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Please sign in to add meals' },
        { status: 401 }
      );
    }

    const mealData = await request.json();

    const { data: meal, error } = await supabase
      .from('meals')
      .insert([{
        ...mealData,
        user_id: session.user.id,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding meal:', error);
      return NextResponse.json(
        { error: 'Failed to add meal' },
        { status: 500 }
      );
    }

    return NextResponse.json(meal);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createClient();
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 401 }
      );
    }

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Please sign in to delete meals' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Meal ID is required' },
        { status: 400 }
      );
    }

    // First check if the meal belongs to the user
    const { data: meal, error: fetchError } = await supabase
      .from('meals')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching meal:', fetchError);
      return NextResponse.json(
        { error: 'Failed to verify meal ownership' },
        { status: 500 }
      );
    }

    if (!meal || meal.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this meal' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error deleting meal:', error);
      return NextResponse.json(
        { error: 'Failed to delete meal' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 