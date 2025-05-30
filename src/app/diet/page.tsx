'use client';

import { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/Modal';
import AddMealForm from '@/components/AddMealForm';
import { Meal } from '@/types/database';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { formatDateTime } from '@/lib/utils/date';

interface MealFormData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

export default function DietTracker() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const fetchMeals = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/meals');
      
      if (!response.ok) {
        throw new Error('Failed to fetch meals');
      }
      
      const data = await response.json();
      setMeals(data);
    } catch (err) {
      console.error('Error fetching meals:', err);
      setError('Failed to load meals');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchMeals();
    }
  }, [user, authLoading, router, fetchMeals]);

  const handleAddMeal = async (data: MealFormData) => {
    if (!user) return;
    
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to add meal');
      
      await fetchMeals();
      setShowAddMeal(false);
    } catch (err) {
      console.error('Error adding meal:', err);
      setError('Failed to add meal');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMeal = async (id: string) => {
    if (!user) return;
    
    try {
      setError(null);
      const response = await fetch(`/api/meals?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete meal');
      }

      setMeals(meals.filter(meal => meal.id !== id));
    } catch (err) {
      console.error('Error deleting meal:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete meal');
    }
  };

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Only show login prompt if we're absolutely sure there's no user
  if (!user && !authLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">Please sign in to access the diet tracker.</p>
        <button
          onClick={() => router.push('/login')}
          className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Show loading spinner while fetching meals
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold leading-6 text-gray-900">Diet Tracker</h2>
          <p className="mt-2 text-sm text-gray-600">
            Log your meals and track your nutritional intake.
          </p>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0">
          <button
            type="button"
            onClick={() => setShowAddMeal(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Meal
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        {error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : meals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No meals logged yet. Start by adding a meal!</p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-100">
            {meals.map((meal) => (
              <li key={meal.id} className="flex items-center justify-between gap-x-6 px-6 py-4">
                <div className="min-w-0">
                  <div className="flex items-start gap-x-3">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{meal.name}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(meal.meal_time)}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                    <p>Calories: {meal.calories}</p>
                    <p>Protein: {meal.protein}g</p>
                    <p>Carbs: {meal.carbs}g</p>
                    <p>Fat: {meal.fat}g</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteMeal(meal.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal open={showAddMeal} setOpen={setShowAddMeal} title="Add Meal">
        <AddMealForm 
          onSubmit={handleAddMeal} 
          onCancel={() => setShowAddMeal(false)} 
          submitting={submitting}
        />
      </Modal>
    </div>
  );
} 