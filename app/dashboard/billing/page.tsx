import { requireAuth } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckoutButton } from "@/components/billing/checkout-button"
import { ManageSubscriptionButton } from "@/components/billing/manage-subscription-button"
import { CreditCard, Calendar, DollarSign, Check, AlertTriangle } from "lucide-react"
import { PLANS, isStripeConfigured } from "@/lib/stripe"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default async function BillingPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: subscription } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single()

  const currentPlan = subscription?.plan_name || "free"
  const hasActiveSubscription = subscription?.stripe_subscription_id && subscription?.status === "active"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNav user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing & Subscription</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your subscription and billing information.</p>
        </div>

        {!isStripeConfigured && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Stripe is not configured. Please add your Stripe environment variables to enable billing functionality.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{currentPlan}</div>
              <Badge variant={subscription?.status === "active" ? "default" : "secondary"} className="mt-2">
                {subscription?.status || "Active"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {subscription?.current_period_end
                  ? new Date(subscription.current_period_end).toLocaleDateString()
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Next payment date</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${PLANS[currentPlan as keyof typeof PLANS]?.price || 0}</div>
              <p className="text-xs text-muted-foreground">per month</p>
            </CardContent>
          </Card>
        </div>

        {hasActiveSubscription && isStripeConfigured && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Manage Subscription</CardTitle>
              <CardDescription>
                Update your payment method, billing address, or cancel your subscription.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ManageSubscriptionButton />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>Choose the plan that best fits your needs.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {Object.entries(PLANS).map(([planKey, plan]) => {
                const isCurrentPlan = currentPlan === planKey
                const canUpgrade = planKey !== "free" && !isCurrentPlan && isStripeConfigured

                return (
                  <div
                    key={planKey}
                    className={`rounded-lg border p-6 ${isCurrentPlan ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <div className="text-2xl font-bold">
                        ${plan.price}
                        <span className="text-sm font-normal text-muted-foreground">/month</span>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {canUpgrade ? (
                      <CheckoutButton planType={planKey}>Upgrade to {plan.name}</CheckoutButton>
                    ) : (
                      <div className="w-full py-2 text-center text-sm text-muted-foreground border rounded-md">
                        {isCurrentPlan ? "Current Plan" : !isStripeConfigured ? "Configure Stripe" : "Contact Sales"}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
