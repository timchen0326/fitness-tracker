'use client';

import { useState, useEffect, useCallback } from 'react';
import { PlusIcon, LightBulbIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/Modal';
import AddExerciseForm from '@/components/AddExerciseForm';
import { Exercise } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { formatDateTime } from '@/lib/utils/date';

interface ExerciseFormData {
  name: string;
  type: string;
  duration: number;
  calories_burned: number;
  date: string;
}

interface RecommendationFormData {
  equipment: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string;
}

export default function ExerciseTracker() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState<{ workout: string; explanation: string } | null>(null);
  const [recommendationForm, setRecommendationForm] = useState<RecommendationFormData>({
    equipment: '',
    fitnessLevel: 'intermediate',
    goals: 'general fitness'
  });

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const fetchExercises = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/exercises');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch exercises');
      }
      
      setExercises(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load exercises';
      setError(message);
      console.error('Error fetching exercises:', err);
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
      fetchExercises();
    }
  }, [user, authLoading, router, fetchExercises]);

  const handleAddExercise = async (data: ExerciseFormData) => {
    if (!user) return;

    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          type: data.type,
          duration: data.duration,
          calories_burned: data.calories_burned,
          exercise_time: data.date
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to add exercise');
      }
      
      await fetchExercises();
      setShowAddExercise(false);
    } catch (err) {
      console.error('Error adding exercise:', err);
      setError(err instanceof Error ? err.message : 'Failed to add exercise');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteExercise = async (id: string) => {
    if (!user) return;

    try {
      setError(null);
      const response = await fetch(`/api/exercises?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete exercise');
      }

      setExercises(exercises.filter(exercise => exercise.id !== id));
    } catch (err) {
      console.error('Error deleting exercise:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete exercise');
    }
  };

  const getAIRecommendation = async () => {
    if (!user) {
      setError('Please sign in to get workout recommendations');
      return;
    }

    if (!recommendationForm.equipment.trim()) {
      setError('Please specify available equipment');
      return;
    }

    setIsLoadingRecommendation(true);
    setError(null);
    try {
      const response = await fetch('/api/exercise/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recommendationForm),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendation');
      }

      setRecommendation(data);
    } catch (error) {
      console.error('Detailed error getting recommendation:', error);
      setError(error instanceof Error ? error.message : 'Failed to get workout recommendation');
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

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
        <p className="text-sm text-gray-500">Please sign in to access the exercise tracker.</p>
        <button
          onClick={() => router.push('/login')}
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
      <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold leading-6 text-gray-900">Exercise Tracker</h2>
          <p className="mt-2 text-sm text-gray-600">
            Log your workouts and get AI-powered exercise recommendations.
          </p>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0">
          <button
            type="button"
            onClick={() => setShowAddExercise(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Log Exercise
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">AI Workout Recommendation</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="equipment" className="block text-sm font-medium text-gray-700">
                  Available Equipment
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="equipment"
                    id="equipment"
                    value={recommendationForm.equipment}
                    onChange={(e) => setRecommendationForm(prev => ({ ...prev, equipment: e.target.value }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., dumbbells, resistance bands, yoga mat"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="fitnessLevel" className="block text-sm font-medium text-gray-700">
                  Fitness Level
                </label>
                <div className="mt-1">
                  <select
                    id="fitnessLevel"
                    name="fitnessLevel"
                    value={recommendationForm.fitnessLevel}
                    onChange={(e) => setRecommendationForm(prev => ({ ...prev, fitnessLevel: e.target.value as RecommendationFormData['fitnessLevel'] }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="goals" className="block text-sm font-medium text-gray-700">
                  Fitness Goals
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="goals"
                    id="goals"
                    value={recommendationForm.goals}
                    onChange={(e) => setRecommendationForm(prev => ({ ...prev, goals: e.target.value }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., strength, weight loss, endurance"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={getAIRecommendation}
                disabled={isLoadingRecommendation || !recommendationForm.equipment.trim()}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LightBulbIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-yellow-400" />
                {isLoadingRecommendation ? 'Generating...' : 'Get Recommendation'}
              </button>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {isLoadingRecommendation && (
                <div className="text-sm text-gray-500">
                  Generating your personalized workout plan...
                </div>
              )}

              {recommendation && (
                <div className="rounded-md bg-gray-50 p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Your Personalized Workout</h4>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-500 font-sans">{recommendation.workout}</pre>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{recommendation.explanation}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Exercise History</h3>
            {error ? (
              <div className="p-6 text-center text-red-600">{error}</div>
            ) : exercises.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No exercises logged yet. Start by logging one!</p>
              </div>
            ) : (
              <ul role="list" className="mt-4 divide-y divide-gray-100">
                {exercises.map((exercise) => (
                  <li key={exercise.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-x-3">
                          <h4 className="text-sm font-semibold leading-6 text-gray-900">
                            {exercise.name}
                          </h4>
                          <p className="text-xs text-gray-500">{exercise.type}</p>
                        </div>
                        <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                          <p>{exercise.duration} minutes</p>
                          <p>{exercise.calories_burned} calories</p>
                          <p>{formatDateTime(exercise.exercise_time)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteExercise(exercise.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={showAddExercise}
        setOpen={setShowAddExercise}
        title="Log Exercise"
      >
        <AddExerciseForm
          onSubmit={handleAddExercise}
          onCancel={() => setShowAddExercise(false)}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
} 