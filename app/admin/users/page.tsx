import { requireAdmin } from "@/lib/admin"
import { createClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin/admin-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminUsersPage() {
  const { user } = await requireAdmin()
  const supabase = await createClient()

  // Get all users with their profiles and subscriptions
  const { data: users } = await supabase
    .from("profiles")
    .select(`
      *,
      subscriptions (
        plan_name,
        status,
        created_at
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNav user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage all users in your application.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>A list of all registered users and their subscription status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((profile) => {
                  const subscription = profile.subscriptions?.[0]
                  const initials =
                    profile.full_name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase() || profile.email.charAt(0).toUpperCase()

                  return (
                    <TableRow key={profile.id}>
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{profile.full_name || "No name"}</span>
                      </TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {subscription?.plan_name || "Free"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subscription?.status === "active" ? "default" : "secondary"}>
                          {subscription?.status || "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
