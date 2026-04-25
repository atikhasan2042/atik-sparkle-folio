import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Create Supabase client for Lovable Cloud auth
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Lovable auth wrapper
export const lovable = {
  auth: {
    signInWithOAuth: async (provider: 'google', options?: { redirect_uri?: string; extraParams?: Record<string, string> }) => {
      try {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: options?.redirect_uri || window.location.origin,
            ...options?.extraParams,
          },
        });

        if (error) {
          return { error, redirected: false };
        }

        // If URL is returned, browser will redirect
        if (data?.url) {
          window.location.href = data.url;
          return { error: null, redirected: true };
        }

        return { error: null, redirected: false };
      } catch (err: any) {
        return { error: { message: err.message }, redirected: false };
      }
    },

    getSession: async () => {
      return await supabaseClient.auth.getSession();
    },

    signOut: async () => {
      return await supabaseClient.auth.signOut();
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      return supabaseClient.auth.onAuthStateChange(callback);
    },
  },
};

// Also export the supabase client for direct use
export { supabaseClient as supabase };
