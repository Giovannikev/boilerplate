import { getSupabaseClient } from "./supabase";
import type { AuthResponse, AuthError } from "@supabase/supabase-js";

interface AuthResult {
  data: AuthResponse["data"];
  error: AuthError | null;
}

interface SignOutResult {
  error: AuthError | null;
}

export const signOut = async (): Promise<SignOutResult> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  return { error };
};

export const signIn = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (
  email: string,
  password: string,
  fullName: string
): Promise<AuthResult> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const sendPasswordResetEmail = async (
  email: string,
  redirectTo: string
): Promise<SignOutResult> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  return { error };
};

export const updateUserPassword = async (
  password: string
): Promise<AuthResult> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  return { data: data as AuthResponse["data"], error };
};
