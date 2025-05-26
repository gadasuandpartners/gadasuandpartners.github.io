// src/lib/authSupabase.ts
import { supabase } from "./supabaseClient";

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  const { user, error, session } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { user, session };
}

// Sign in with Google
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + "/admin"
    }
  });
  if (error) throw error;
}

// Sign out
export async function signOutSupabase() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get current user
export function getCurrentUser() {
  return supabase.auth.getUser();
}