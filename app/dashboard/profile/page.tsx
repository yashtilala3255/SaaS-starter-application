import { requireAuth, getUserProfile } from "@/lib/auth"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfilePage() {
  const user = await requireAuth()
  const profile = await getUserProfile()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNav user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account information and preferences.</p>
        </div>

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details and contact information.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} profile={profile} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
