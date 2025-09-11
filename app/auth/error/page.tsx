import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const error = params?.error

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {error ? (
              <p className="text-sm text-muted-foreground">Error: {error}</p>
            ) : (
              <p className="text-sm text-muted-foreground">An authentication error occurred. Please try again.</p>
            )}
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
