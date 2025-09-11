export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  status: "active" | "inactive" | "canceled" | "past_due"
  plan_name: "free" | "pro" | "enterprise"
  current_period_start?: string
  current_period_end?: string
  created_at: string
  updated_at: string
}

export interface UsageLog {
  id: string
  user_id: string
  action: string
  metadata?: Record<string, any>
  created_at: string
}
