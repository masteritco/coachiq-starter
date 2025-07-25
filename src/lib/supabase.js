import { createClient } from '@supabase/supabase-js';

// Production Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Production validation - check if values are properly configured
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'undefined' &&
  supabaseAnonKey !== 'undefined' &&
  supabaseUrl !== 'null' &&
  supabaseAnonKey !== 'null' &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here' &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.startsWith('eyJ')
);

// Production logging
console.log('🔍 Supabase Status:', isSupabaseConfigured ? '✅ Connected' : '❌ Not configured');
console.log('🔍 Supabase URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'Not set');
console.log('🔍 Supabase Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Not set');

// Always create real Supabase client for production
export const supabase = (() => {
  if (!isSupabaseConfigured) {
    console.error('❌ Supabase not configured! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    // Return a mock client that will fail gracefully
    return {
      auth: {
        signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        signOut: () => Promise.resolve({ error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }) }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        update: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) })
      })
    };
  }

  console.log('🚀 Initializing Supabase client for production');
  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    }
  );
})();

// UserProfile type definition (for reference)
// {
//   id: string;
//   email: string;
//   subscription_tier: 'free' | 'starter' | 'pro' | 'enterprise';
//   created_at: string;
//   updated_at: string;
// }