import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  // Check if user has admin role
  const { data: adminRole, error } = await supabase.from("admin_roles").select("*").eq("user_id", user.id).single()

  if (error || !adminRole) {
    redirect("/dashboard")
  }

  return { user, adminRole }
}

export async function getAdminStats() {
  const supabase = await createClient()

  // Get total users
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  // Get active subscriptions
  const { count: activeSubscriptions } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .neq("plan_name", "free")

  // Get total revenue (mock calculation)
  const { data: subscriptions } = await supabase.from("subscriptions").select("plan_name").eq("status", "active")

  const revenue =
    subscriptions?.reduce((total, sub) => {
      if (sub.plan_name === "pro") return total + 29
      if (sub.plan_name === "enterprise") return total + 99
      return total
    }, 0) || 0

  // Get recent activity
  const { data: recentActivity } = await supabase
    .from("usage_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  return {
    totalUsers: totalUsers || 0,
    activeSubscriptions: activeSubscriptions || 0,
    monthlyRevenue: revenue,
    recentActivity: recentActivity || [],
  }
}
