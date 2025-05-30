'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getCurrentTorontoTime } from '@/lib/utils/date';

const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  calories_burned: z.number().min(0, 'Calories must be a positive number'),
  type: z.string().min(1, 'Exercise type is required'),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

interface AddExerciseFormProps {
  onSubmit: (data: ExerciseFormData & { date: string }) => void;
  onCancel: () => void;
  submitting?: boolean;
}

const exerciseTypes = [
  'Cardio',
  'Strength Training',
  'HIIT',
  'Yoga',
  'Pilates',
  'Swimming',
  'Cycling',
  'Running',
  'Walking',
  'Other',
];

export default function AddExerciseForm({ onSubmit, onCancel, submitting = false }: AddExerciseFormProps) {
  const [date, setDate] = useState(getCurrentTorontoTime());
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
  });

  const onFormSubmit = (data: ExerciseFormData) => {
    onSubmit({ ...data, date });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Exercise Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Exercise Type
        </label>
        <select
          id="type"
          {...register('type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a type</option>
          {exerciseTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date & Time
        </label>
        <input
          type="datetime-local"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (minutes)
          </label>
          <input
            type="number"
            id="duration"
            {...register('duration', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="calories_burned" className="block text-sm font-medium text-gray-700">
            Calories Burned
          </label>
          <input
            type="number"
            id="calories_burned"
            {...register('calories_burned', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.calories_burned && (
            <p className="mt-1 text-sm text-red-600">{errors.calories_burned.message}</p>
          )}
        </div>
      </div>

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
        >
          {submitting ? 'Adding...' : 'Add Exercise'}
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