'use client';

import { useState, useEffect } from 'react';
import { CalendarDaysIcon, ScaleIcon, FireIcon } from '@heroicons/react/24/outline';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { startOfToday, endOfToday, startOfWeek, endOfWeek } from 'date-fns';
import { formatDateTime } from '@/lib/utils/date';
import { Exercise, Meal } from '@/types/database';

interface Profile {
  weight: number;
  goal_weight: number;
  daily_calorie_goal: number;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState([
    { name: 'Daily Calories', value: '0', target: '0', icon: FireIcon },
    { name: 'Current Weight', value: '0 kg', target: '0 kg', icon: ScaleIcon },
    { name: 'Active Days', value: '0/7', target: '7/7', icon: CalendarDaysIcon },
  ]);

  const [recentExercises, setRecentExercises] = useState<Exercise[]>([]);
  const [recentMeals, setRecentMeals] = useState<Meal[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
      return;
    }

    const fetchData = async () => {
      if (!user) return;
      
      try {
        const today = new Date();
        const todayStart = startOfToday().toISOString();
        const todayEnd = endOfToday().toISOString();

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('weight, goal_weight, daily_calorie_goal')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile(profileData);
        }

        // Fetch today's meals with all necessary data
        const { data: todayMeals, error: mealsError } = await supabase
          .from('meals')
          .select('*')
          .eq('user_id', user.id)
          .gte('meal_time', todayStart)
          .lte('meal_time', todayEnd);

        if (mealsError) {
          console.error('Error fetching meals:', mealsError);
          throw new Error('Failed to fetch meals');
        }

        console.log('Today start:', todayStart);
        console.log('Today end:', todayEnd);
        console.log('Raw meals data:', todayMeals);

        // Calculate total calories for today
        const totalCalories = todayMeals?.reduce((sum, meal) => {
          console.log('Processing meal:', {
            id: meal.id,
            name: meal.name,
            calories: meal.calories,
            mealTime: meal.meal_time
          });
          return sum + (meal.calories || 0);
        }, 0) || 0;

        console.log('Final total calories:', totalCalories);

        // Fetch exercises for the current week
        const { data: weekExercises, error: exercisesError } = await supabase
          .from('exercises')
          .select('exercise_time')
          .eq('user_id', user.id)
          .gte('exercise_time', startOfWeek(today).toISOString())
          .lte('exercise_time', endOfWeek(today).toISOString());

        if (exercisesError) {
          console.error('Error fetching exercises:', exercisesError);
          throw new Error('Failed to fetch exercises');
        }

        // Calculate active days
        const activeDays = new Set(
          weekExercises?.map(ex => new Date(ex.exercise_time).toDateString())
        ).size;

        // Update stats with actual profile data and calculated calories
        setStats([
          { 
            name: 'Daily Calories', 
            value: totalCalories.toString(), 
            target: profileData?.daily_calorie_goal?.toString() || '2000', 
            icon: FireIcon 
          },
          { 
            name: 'Current Weight', 
            value: profileData?.weight ? `${profileData.weight} kg` : 'Not set', 
            target: profileData?.goal_weight ? `${profileData.goal_weight} kg` : 'Not set', 
            icon: ScaleIcon 
          },
          { 
            name: 'Active Days', 
            value: `${activeDays}/7`, 
            target: '7/7', 
            icon: CalendarDaysIcon 
          },
        ]);

        // Fetch recent data
        const [{ data: meals, error: recentMealsError }, { data: exercises, error: recentExercisesError }] = await Promise.all([
          supabase
            .from('meals')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('exercises')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5)
        ]);

        if (recentMealsError) throw new Error('Failed to fetch recent meals');
        if (recentExercisesError) throw new Error('Failed to fetch recent exercises');

        setRecentMeals(meals || []);
        setRecentExercises(exercises || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, authLoading, router, supabase]);

  // Use profile in a useEffect to update stats when it changes
  useEffect(() => {
    if (profile) {
      setStats(currentStats => currentStats.map(stat => {
        if (stat.name === 'Current Weight') {
          return {
            ...stat,
            value: profile.weight ? `${profile.weight} kg` : 'Not set',
            target: profile.goal_weight ? `${profile.goal_weight} kg` : 'Not set'
          };
        }
        if (stat.name === 'Daily Calories') {
          return {
            ...stat,
            target: profile.daily_calorie_goal?.toString() || '2000'
          };
        }
        return stat;
      }));
    }
  }, [profile]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">Please sign in to view your dashboard.</p>
        <button
          onClick={() => router.push('/auth/signin')}
          className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <div className="p-6">
              <div className="flex items-center gap-x-3">
                <item.icon className="h-6 w-6 text-gray-400" />
                <h3 className="text-sm font-medium leading-6 text-gray-900">{item.name}</h3>
              </div>
              <div className="mt-3 flex items-baseline gap-x-2">
                <p className="text-2xl font-semibold tracking-tight text-indigo-600">{item.value}</p>
                <p className="text-sm text-gray-500">/ {item.target}</p>
              </div>
            </div>
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
                        <p className="text-xs text-gray-500">
                          {formatDateTime(meal.meal_time)}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                        <p>{meal.calories} calories</p>
                        <p>{meal.protein}g protein</p>
                        <p>{meal.carbs}g carbs</p>
                        <p>{meal.fat}g fat</p>
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

      <p className="text-center text-gray-600 mt-4">
        Let&apos;s achieve your fitness goals together!
      </p>
    </div>
  );
} 