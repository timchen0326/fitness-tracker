import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

export const createClient = () => {
  return createClientComponentClient<Database>();
};

// This is a convenience wrapper for components that don't need to create their own client
export const supabase = createClientComponentClient<Database>(); 