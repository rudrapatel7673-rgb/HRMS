import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing! Check your .env file.');
}

let supabaseInstance;
try {
    supabaseInstance = createClient(supabaseUrl || '', supabaseAnonKey || '');
} catch (err) {
    console.error('Critical: Failed to initialize Supabase client:', err);
    // Provide a dummy mock or similar to avoid app-wide crashes
    supabaseInstance = {
        auth: { getSession: async () => ({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }) },
        from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: null }) }), order: () => ({ limit: async () => ({ data: [] }) }) }) })
    };
}

export const supabase = supabaseInstance;
