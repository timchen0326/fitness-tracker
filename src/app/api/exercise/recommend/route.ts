import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const COHERE_API_KEY = process.env.COHERE_API_KEY;
const API_URL = "https://api.cohere.ai/v1/generate";

async function generateWorkoutPlan(prompt: string) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COHERE_API_KEY}`,
      "Content-Type": "application/json",
      "Cohere-Version": "2022-12-06"
    },
    body: JSON.stringify({
      model: "command",
      prompt: `You are an expert fitness trainer. Create a personalized workout plan. ${prompt}`,
      max_tokens: 1000,
      temperature: 0.7,
      k: 0,
      stop_sequences: [],
      return_likelihoods: "NONE"
    }),
  });

  if (!response.ok) {
    throw new Error(`Cohere API error: ${response.statusText}`);
  }

  const result = await response.json();
  return result.generations[0].text;
}

export async function POST(request: Request) {
  try {
    console.log('Received recommendation request');
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.log('No authenticated user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Request body:', body);
    
    const { equipment, fitnessLevel = 'intermediate', goals = 'general fitness' } = body;

    if (!equipment) {
      console.log('No equipment specified');
      return NextResponse.json(
        { error: 'Equipment information is required' },
        { status: 400 }
      );
    }

    // Get user's exercise history for better recommendations
    const { data: exerciseHistory, error: historyError } = await supabase
      .from('exercises')
      .select('type, duration')
      .eq('user_id', session.user.id)
      .order('exercise_time', { ascending: false })
      .limit(5);

    if (historyError) {
      console.error('Error fetching exercise history:', historyError);
    }

    console.log('Exercise history:', exerciseHistory);

    const prompt = `Create a personalized workout routine based on:

Equipment Available: ${equipment}
Fitness Level: ${fitnessLevel}
Fitness Goals: ${goals}
Recent Exercise History: ${exerciseHistory ? JSON.stringify(exerciseHistory) : 'No recent history'}

Please provide:
1. Warm-up routine (2-3 exercises)
2. Main workout with:
   - Exercise name
   - Sets and reps
   - Proper form cues
   - Rest periods
3. Cool-down routine
4. Total estimated time
5. Safety tips

Format the response in a clear, structured way.`;

    console.log('Sending prompt to Cohere');
    const recommendation = await generateWorkoutPlan(prompt);
    console.log('Received Cohere response');

    try {
      // Store the recommendation for future reference
      const { error: insertError } = await supabase
        .from('workout_recommendations')
        .insert([{
          user_id: session.user.id,
          equipment,
          fitness_level: fitnessLevel,
          goals,
          recommendation,
          created_at: new Date().toISOString(),
        }]);

      if (insertError) {
        console.error('Error storing recommendation:', insertError);
      }
    } catch (storageError) {
      console.error('Error in recommendation storage:', storageError);
      // Continue even if storage fails
    }

    console.log('Sending response back to client');
    return NextResponse.json({
      workout: recommendation,
      explanation: "This personalized workout plan is based on your available equipment, fitness level, and recent exercise history.",
    });
  } catch (error) {
    console.error('Detailed error in recommendation generation:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Cohere')) {
        return NextResponse.json(
          { error: 'Unable to generate recommendation at the moment. Please try again later.' },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate workout recommendation' },
      { status: 500 }
    );
  }
} 