import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect("/auth/login")
  }
  return user
}

export async function getUserProfile() {
  const supabase = await createClient()
  const user = await requireAuth()

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  // If no profile exists, create one
  if (!profile) {
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata?.full_name || "",
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating profile:", insertError)
      return null
    }

    return newProfile
  }

  return profile
}
