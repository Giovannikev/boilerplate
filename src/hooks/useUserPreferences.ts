"use client"

import { useEffect, useState } from "react"
import { useAuth } from "./useAuth"
import { getUserPreferences, updateUserPreferences, createUserPreferences } from "@/services/userPreferences"
import type { UserPreferences } from "@/services/userPreferences"

export function useUserPreferences() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load preferences on mount
  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    const loadPreferences = async () => {
      try {
        const { data, error } = await getUserPreferences(user.id)

        if (error) {
          // Create default preferences if not found
          const { data: newPrefs } = await createUserPreferences(user.id)
          if (newPrefs) {
            setPreferences(newPrefs)
          }
        } else if (data) {
          setPreferences(data)
        }
      } catch (err) {
        console.error("[v0] Error loading preferences:", err)
      } finally {
        setLoading(false)
      }
    }

    loadPreferences()
  }, [user?.id])

  const updatePreferences = async (
    updates: Partial<Omit<UserPreferences, "user_id" | "created_at" | "updated_at">>,
  ) => {
    if (!user?.id || !preferences) return

    try {
      setSaving(true)
      const { data, error } = await updateUserPreferences(user.id, updates)

      if (error) throw error
      if (data) {
        setPreferences(data)
      }
    } catch (err) {
      console.error("[v0] Error updating preferences:", err)
      throw err
    } finally {
      setSaving(false)
    }
  }

  return {
    preferences,
    loading,
    saving,
    updatePreferences,
  }
}
