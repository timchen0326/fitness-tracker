'use client';

import { useState, useEffect } from 'react';
import { CalendarDaysIcon, ScaleIcon, FireIcon } from '@heroicons/react/24/outline';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { startOfToday, endOfToday, startOfWeek, endOfWeek } from 'date-fns';
import { formatDateTime } from '@/lib/utils/date';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_time: string;
  created_at: string;
}

interface Exercise {
  id: string;
  name: string;
  type: string;
  duration: number;
  calories_burned: number;
  exercise_time: string;
  created_at: string;
}

interface Profile {
  weight: number | null;
  goal_weight: number | null;
  daily_calorie_goal: number | null;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { name: 'Daily Calories', value: '0', target: '0', icon: FireIcon },
    { name: 'Current Weight', value: '0 kg', target: '0 kg', icon: ScaleIcon },
    { name: 'Active Days', value: '0/7', target: '7/7', icon: CalendarDaysIcon },
  ]);

  const [recentMeals, setRecentMeals] = useState<Meal[]>([]);
  const [recentExercises, setRecentExercises] = useState<Exercise[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('weight, goal_weight, daily_calorie_goal')
          .eq('id', user.id)
          .single();

        // Fetch today's meals
        const today = new Date();
        const { data: todayMeals } = await supabase
          .from('meals')
          .select('calories')
          .eq('user_id', user.id)
          .gte('meal_time', startOfToday().toISOString())
          .lte('meal_time', endOfToday().toISOString());

        // Calculate total calories for today
        const totalCalories = todayMeals?.reduce((sum, meal) => sum + meal.calories, 0) || 0;

        // Fetch exercises for the current week
        const { data: weekExercises } = await supabase
          .from('exercises')
          .select('exercise_time')
          .eq('user_id', user.id)
          .gte('exercise_time', startOfWeek(today).toISOString())
          .lte('exercise_time', endOfWeek(today).toISOString());

        // Calculate active days (unique days with exercises)
        const activeDays = new Set(
          weekExercises?.map(ex => new Date(ex.exercise_time).toDateString())
        ).size;

        // Fetch recent meals
        const { data: meals } = await supabase
          .from('meals')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch recent exercises
        const { data: exercises } = await supabase
          .from('exercises')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        // Update stats
        setStats([
          {
            name: 'Daily Calories',
            value: totalCalories.toString(),
            target: profile?.daily_calorie_goal?.toString() || '2,300',
            icon: FireIcon
          },
          {
            name: 'Current Weight',
            value: profile?.weight ? `${profile.weight} kg` : 'Not set',
            target: profile?.goal_weight ? `${profile.goal_weight} kg` : 'Not set',
            icon: ScaleIcon
          },
          {
            name: 'Active Days',
            value: `${activeDays}/7`,
            target: '7/7',
            icon: CalendarDaysIcon
          },
        ]);

        if (meals) setRecentMeals(meals);
        if (exercises) setRecentExercises(exercises);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, user]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-semibold leading-6 text-gray-900">Dashboard</h2>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here's an overview of your fitness journey.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className="ml-2 text-sm text-gray-500">/ {stat.target}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Meals</h3>
            <div className="mt-4">
              {recentMeals.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {recentMeals.map((meal) => (
                    <li key={meal.id} className="py-4">
                      <div className="flex items-center gap-x-3">
                        <h4 className="text-sm font-semibold leading-6 text-gray-900">
                          {meal.name}
                        </h4>
                        <p className="text-xs text-gray-500">{formatDateTime(meal.meal_time)}</p>
                      </div>
                      <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                        <p>Calories: {meal.calories}</p>
                        <p>Protein: {meal.protein}g</p>
                        <p>Carbs: {meal.carbs}g</p>
                        <p>Fat: {meal.fat}g</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No meals logged yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Exercises</h3>
            <div className="mt-4">
              {recentExercises.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {recentExercises.map((exercise) => (
                    <li key={exercise.id} className="py-4">
                      <div className="flex items-center gap-x-3">
                        <h4 className="text-sm font-semibold leading-6 text-gray-900">
                          {exercise.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(exercise.exercise_time)}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                        <p>{exercise.duration} minutes</p>
                        <p>{exercise.calories_burned} calories</p>
                        <p>{exercise.type}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No exercises logged yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 