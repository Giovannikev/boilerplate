import { getSupabaseClient } from "./supabase"
import type { PostgrestError } from "@supabase/supabase-js"

export interface UserPreferences {
  user_id: string
  currency: "EUR" | "MGA"
  language: "fr" | "en"
  created_at: string
  updated_at: string
} 

interface PreferencesResult<T> {
  data: T | null
  error: PostgrestError | null
}

// Get user preferences
export const getUserPreferences = async (userId: string): Promise<PreferencesResult<UserPreferences>> => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("user_preferences").select("*").eq("user_id", userId).single()

  return { data: data as UserPreferences | null, error }
}

// Update user preferences
export const updateUserPreferences = async (
  userId: string,
  updates: Partial<Omit<UserPreferences, "user_id" | "created_at" | "updated_at">>,
): Promise<PreferencesResult<UserPreferences>> => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("user_preferences")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select()
    .single()

  return { data: data as UserPreferences | null, error }
}

// Create default preferences for new user
export const createUserPreferences = async (userId: string): Promise<PreferencesResult<UserPreferences>> => {
  const supabase = getSupabaseClient()
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from("user_preferences")
    .insert([{ user_id: userId, currency: "EUR", language: "fr", created_at: now, updated_at: now }])
    .select()
    .single()

  return { data: data as UserPreferences | null, error }
}
