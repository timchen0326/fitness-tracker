export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  height: number | null;
  weight: number | null;
  goal_weight: number | null;
  activity_level: string | null;
  daily_calorie_goal: number | null;
  created_at: string;
  updated_at: string;
}

export interface Meal {
  id: string;
  user_id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_time: string;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  user_id: string;
  name: string;
  type: string;
  exercise_category: 'cardio' | 'strength' | 'flexibility' | 'sports';
  duration?: number;
  calories_burned?: number;
  sets?: number;
  reps?: number;
  weight?: number;
  distance?: number;
  exercise_time: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      meals: {
        Row: Meal;
        Insert: Omit<Meal, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Meal, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      exercises: {
        Row: Exercise;
        Insert: Omit<Exercise, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Exercise, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
} 