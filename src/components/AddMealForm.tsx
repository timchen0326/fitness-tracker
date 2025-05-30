'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentTorontoTime } from '@/lib/utils/date';

const mealSchema = z.object({
  name: z.string().min(1, 'Meal name is required'),
  calories: z.coerce.number().min(0, 'Calories must be a positive number'),
  protein: z.coerce.number().min(0, 'Protein must be a positive number'),
  carbs: z.coerce.number().min(0, 'Carbs must be a positive number'),
  fat: z.coerce.number().min(0, 'Fat must be a positive number'),
});

type MealFormData = z.infer<typeof mealSchema>;

interface AddMealFormProps {
  onSubmit: (data: MealFormData & { time: string }) => void;
  onCancel: () => void;
  submitting?: boolean;
}

export default function AddMealForm({ onSubmit, onCancel, submitting = false }: AddMealFormProps) {
  const [time, setTime] = useState(getCurrentTorontoTime());
  const { user } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }
  });

  const onFormSubmit = (data: MealFormData) => {
    if (!user) return;
    onSubmit({ ...data, time });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Meal Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={submitting}
          placeholder="Enter meal name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
          Time
        </label>
        <input
          type="datetime-local"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={submitting}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
            Calories
          </label>
          <input
            type="number"
            id="calories"
            min="0"
            step="1"
            {...register('calories')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={submitting}
            placeholder="0"
          />
          {errors.calories && (
            <p className="mt-1 text-sm text-red-600">{errors.calories.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="protein" className="block text-sm font-medium text-gray-700">
            Protein (g)
          </label>
          <input
            type="number"
            id="protein"
            min="0"
            step="1"
            {...register('protein')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={submitting}
            placeholder="0"
          />
          {errors.protein && (
            <p className="mt-1 text-sm text-red-600">{errors.protein.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="carbs" className="block text-sm font-medium text-gray-700">
            Carbs (g)
          </label>
          <input
            type="number"
            id="carbs"
            min="0"
            step="1"
            {...register('carbs')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={submitting}
            placeholder="0"
          />
          {errors.carbs && (
            <p className="mt-1 text-sm text-red-600">{errors.carbs.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="fat" className="block text-sm font-medium text-gray-700">
            Fat (g)
          </label>
          <input
            type="number"
            id="fat"
            min="0"
            step="1"
            {...register('fat')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={submitting}
            placeholder="0"
          />
          {errors.fat && (
            <p className="mt-1 text-sm text-red-600">{errors.fat.message}</p>
          )}
        </div>
      </div>

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
        >
          {submitting ? 'Adding...' : 'Add Meal'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
        >
          Cancel
        </button>
      </div>
    </form>
  );
} 