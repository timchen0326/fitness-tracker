'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getCurrentEasternTime, toEasternTime } from '@/lib/utils/date';

const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  type: z.string().min(1, 'Exercise type is required'),
  exercise_category: z.enum(['cardio', 'strength', 'flexibility', 'sports']),
  // Optional fields based on category
  duration: z.number().min(0).optional(),
  calories_burned: z.number().min(0).optional(),
  sets: z.number().min(0).optional(),
  reps: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  distance: z.number().min(0).optional(),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

interface AddExerciseFormProps {
  onSubmit: (data: ExerciseFormData & { date: string }) => void;
  onCancel: () => void;
  submitting?: boolean;
}

const exerciseTypes = {
  cardio: ['Running', 'Cycling', 'Swimming', 'Walking', 'Rowing', 'HIIT', 'Other Cardio'],
  strength: ['Weight Training', 'Bodyweight Exercise', 'Resistance Bands', 'Other Strength'],
  flexibility: ['Yoga', 'Pilates', 'Stretching', 'Other Flexibility'],
  sports: ['Basketball', 'Tennis', 'Soccer', 'Other Sports']
};

export default function AddExerciseForm({ onSubmit, onCancel, submitting = false }: AddExerciseFormProps) {
  // Initialize with current date-time in EST
  const [date, setDate] = useState(() => getCurrentEasternTime());
  
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof exerciseTypes>('cardio');
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: '',
      type: '',
      exercise_category: 'cardio',
    }
  });

  const exerciseCategory = watch('exercise_category');

  // Update selected category and reset type when category changes
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value as keyof typeof exerciseTypes;
    setSelectedCategory(category);
    setValue('exercise_category', category);
    setValue('type', ''); // Reset type when category changes
    // Reset category-specific fields
    setValue('sets', undefined);
    setValue('reps', undefined);
    setValue('weight', undefined);
    setValue('duration', undefined);
    setValue('distance', undefined);
    setValue('calories_burned', undefined);
  };

  const onFormSubmit = (data: ExerciseFormData) => {
    // Remove undefined values
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined && v !== '')
    );
    
    // Ensure we have a valid date in EST
    let dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      dateObj = toEasternTime(new Date()); // Fallback to current EST time
    } else {
      dateObj = toEasternTime(dateObj); // Convert to EST
    }
    
    // Submit with the ISO string date
    onSubmit({
      ...cleanData,
      date: dateObj.toISOString()
    } as ExerciseFormData & { date: string });
  };

  const renderCategorySpecificFields = () => {
    switch (exerciseCategory) {
      case 'strength':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="sets" className="block text-sm font-medium text-gray-700">
                Sets
              </label>
              <input
                type="number"
                id="sets"
                {...register('sets', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="reps" className="block text-sm font-medium text-gray-700">
                Reps
              </label>
              <input
                type="number"
                id="reps"
                {...register('reps', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                step="0.1"
                {...register('weight', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        );
      case 'cardio':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration (min)
              </label>
              <input
                type="number"
                id="duration"
                {...register('duration', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
                Distance (km)
              </label>
              <input
                type="number"
                id="distance"
                step="0.01"
                {...register('distance', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="calories_burned" className="block text-sm font-medium text-gray-700">
                Calories
              </label>
              <input
                type="number"
                id="calories_burned"
                {...register('calories_burned', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        );
      case 'flexibility':
      case 'sports':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration (min)
              </label>
              <input
                type="number"
                id="duration"
                {...register('duration', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="calories_burned" className="block text-sm font-medium text-gray-700">
                Calories
              </label>
              <input
                type="number"
                id="calories_burned"
                {...register('calories_burned', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="exercise_category" className="block text-sm font-medium text-gray-700">
          Exercise Category
        </label>
        <select
          id="exercise_category"
          {...register('exercise_category')}
          onChange={handleCategoryChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="cardio">Cardio</option>
          <option value="strength">Strength Training</option>
          <option value="flexibility">Flexibility</option>
          <option value="sports">Sports</option>
        </select>
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
          {exerciseTypes[selectedCategory].map((type) => (
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Exercise Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., Bench Press, 5K Run"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
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

      {renderCategorySpecificFields()}

      <div className="mt-4 flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {submitting ? 'Saving...' : 'Save Exercise'}
        </button>
      </div>
    </form>
  );
} 