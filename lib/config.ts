export const config = {
  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    jwtSecret: process.env.SUPABASE_JWT_SECRET!,
    redirectUrl: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000",
  },

  // Stripe Configuration
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    proPriceId: process.env.STRIPE_PRO_PRICE_ID || "",
    enterprisePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "",
  },

  // Database Configuration
  database: {
    url: process.env.POSTGRES_URL!,
    prismaUrl: process.env.POSTGRES_PRISMA_URL!,
    nonPoolingUrl: process.env.POSTGRES_URL_NON_POOLING!,
    host: process.env.POSTGRES_HOST!,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DATABASE!,
  },

  // App Configuration
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    environment: process.env.NODE_ENV || "development",
  },
} as const

// Configuration validation functions
export const isSupabaseConfigured = () => {
  return !!(config.supabase.url && config.supabase.anonKey)
}

export const isStripeConfigured = () => {
  return !!(config.stripe.secretKey && config.stripe.publishableKey)
}

export const isStripeWebhookConfigured = () => {
  return !!config.stripe.webhookSecret
}

export const areStripePricesConfigured = () => {
  return !!(config.stripe.proPriceId && config.stripe.enterprisePriceId)
}

export const isDatabaseConfigured = () => {
  return !!config.database.url
}

// Get configuration status for debugging
export const getConfigurationStatus = () => {
  return {
    supabase: isSupabaseConfigured(),
    stripe: isStripeConfigured(),
    stripeWebhook: isStripeWebhookConfigured(),
    stripePrices: areStripePricesConfigured(),
    database: isDatabaseConfigured(),
  }
}
