import { requireAuth, getUserProfile } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { UsageChart } from "@/components/dashboard/usage-chart"
import { Activity, CreditCard, User, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const user = await requireAuth()
  const profile = await getUserProfile()
  const supabase = await createClient()

  // Get subscription info
  const { data: subscription } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single()

  // Get recent usage logs
  const { data: usageLogs } = await supabase
    .from("usage_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const usageCount = usageLogs?.length || 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNav user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile?.full_name || user.email}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Here's what's happening with your account today.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{subscription?.plan_name || "Free"}</div>
              <Badge variant={subscription?.status === "active" ? "default" : "secondary"} className="mt-2">
                {subscription?.status || "Inactive"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usage This Month</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageCount}</div>
              <p className="text-xs text-muted-foreground">actions performed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">since {new Date(user.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12%</div>
              <p className="text-xs text-muted-foreground">from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Usage Overview</CardTitle>
              <CardDescription>Your activity over the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <UsageChart data={usageLogs || []} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageLogs && usageLogs.length > 0 ? (
                  usageLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
