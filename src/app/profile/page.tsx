'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ProfileFormData {
  full_name: string;
  avatar_url: string;
  height: number;
  weight: number;
  goal_weight: number;
  activity_level: string;
  daily_calorie_goal: number;
}

const activityLevels = [
  'Sedentary',
  'Lightly Active',
  'Moderately Active',
  'Very Active',
  'Extremely Active'
];

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormData>({
    full_name: '',
    avatar_url: '',
    height: 0,
    weight: 0,
    goal_weight: 0,
    activity_level: 'Moderately Active',
    daily_calorie_goal: 2300
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfileData({
            full_name: data.full_name || '',
            avatar_url: data.avatar_url || '',
            height: data.height || 0,
            weight: data.weight || 0,
            goal_weight: data.goal_weight || 0,
            activity_level: data.activity_level || 'Moderately Active',
            daily_calorie_goal: data.daily_calorie_goal || 2300
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          height: profileData.height,
          weight: profileData.weight,
          goal_weight: profileData.goal_weight,
          activity_level: profileData.activity_level,
          daily_calorie_goal: profileData.daily_calorie_goal
        })
        .eq('id', user.id);

      if (error) throw error;

      setSuccess(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: ['full_name', 'avatar_url', 'activity_level'].includes(name) ? value : Number(value)
    }));
  };

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
        <h2 className="text-2xl font-semibold leading-6 text-gray-900">Profile</h2>
        <p className="mt-2 text-sm text-gray-600">
          Manage your account settings and preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={user.email}
                      disabled
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-50"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-900">
                    Full Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="full_name"
                      id="full_name"
                      value={profileData.full_name}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-900">
                    Avatar URL
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="avatar_url"
                      id="avatar_url"
                      value={profileData.avatar_url}
                      onChange={handleChange}
                      placeholder="https://example.com/avatar.jpg"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="height" className="block text-sm font-medium text-gray-900">
                    Height (cm)
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="height"
                      id="height"
                      value={profileData.height}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-900">
                    Current Weight (kg)
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      value={profileData.weight}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="goal_weight" className="block text-sm font-medium text-gray-900">
                    Goal Weight (kg)
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="goal_weight"
                      id="goal_weight"
                      value={profileData.goal_weight}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="daily_calorie_goal" className="block text-sm font-medium text-gray-900">
                    Daily Calorie Goal
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="daily_calorie_goal"
                      id="daily_calorie_goal"
                      value={profileData.daily_calorie_goal}
                      onChange={handleChange}
                      min="0"
                      step="50"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Set your target daily calorie intake
                  </p>
                </div>

                <div className="mt-6">
                  <label htmlFor="activity_level" className="block text-sm font-medium text-gray-900">
                    Activity Level
                  </label>
                  <div className="mt-2">
                    <select
                      name="activity_level"
                      id="activity_level"
                      value={profileData.activity_level}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      {activityLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
            {success && (
              <div className="text-sm text-green-600">Profile updated successfully!</div>
            )}
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 