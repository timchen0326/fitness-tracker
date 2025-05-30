import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export async function getServerSession() {
  const supabase = createServerComponentClient({ cookies });
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
} 