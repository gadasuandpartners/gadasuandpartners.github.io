// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug environment variables (only in development)
if (import.meta.env.DEV) {
  console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Missing');
}

// More graceful environment variable handling
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(`
    Missing Supabase environment variables.
    Please check your .env file and ensure it contains:
    VITE_SUPABASE_URL=your_supabase_url_here
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
  `);
}

// Create Supabase client with debug mode in development
const supabaseInstance = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    debug: import.meta.env.DEV
  }
});

// Connection state
let connectionState = {
  isOffline: false,
  lastError: null as Error | null
};

// Browser-specific features
if (typeof window !== 'undefined') {
  connectionState.isOffline = !window.navigator.onLine;

  window.addEventListener('online', () => {
    console.log('Connection restored');
    connectionState.isOffline = false;
    testConnection(); // Test connection when we come back online
  });

  window.addEventListener('offline', () => {
    console.warn('Connection lost');
    connectionState.isOffline = true;
  });
}

// Test connection function
async function testConnection() {
  console.log('Testing Supabase connection...');
  try {
    const start = performance.now();
    const { count, error } = await supabaseInstance.from('projects')
      .select('count', { count: 'exact', head: true });
    const duration = performance.now() - start;
    
    if (error) {
      console.error('Failed to connect to Supabase:', {
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      connectionState.lastError = error;
      return false;
    }

    console.log(`Successfully connected to Supabase (${duration.toFixed(0)}ms). Project count:`, count);
    connectionState.lastError = null;
    return true;
  } catch (error) {
    console.error('Unexpected error testing Supabase connection:', error);
    connectionState.lastError = error as Error;
    return false;
  }
}

// Test connection in development
if (import.meta.env.DEV) {
  void testConnection();
}

export const supabase = supabaseInstance;
export const isConnectionOffline = () => connectionState.isOffline;
export const getLastError = () => connectionState.lastError;
export const checkConnection = () => testConnection();