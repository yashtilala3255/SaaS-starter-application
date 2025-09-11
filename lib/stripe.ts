import Stripe from "stripe"
import { config, areStripePricesConfigured } from "./config"

let stripe: Stripe | null = null

export function isStripeConfigured() {
  return !!config.stripe.secretKey
}

if (isStripeConfigured()) {
  stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: "2024-06-20",
    typescript: true,
  })
}

export { stripe }

export const isStripeReady = isStripeConfigured()
export const arePricesConfigured = areStripePricesConfigured()

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: "", // No Stripe price ID for free plan
    features: ["Up to 10 projects", "Basic authentication", "Community support"],
  },
  pro: {
    name: "Pro",
    price: 29,
    priceId: config.stripe.proPriceId,
    features: ["Unlimited projects", "Advanced authentication", "Priority support", "API access"],
  },
  enterprise: {
    name: "Enterprise",
    price: 99,
    priceId: config.stripe.enterprisePriceId,
    features: ["Everything in Pro", "Dedicated support", "Custom development", "SLA guarantee"],
  },
} as const

export type PlanType = keyof typeof PLANS

export const validatePriceId = async (priceId: string): Promise<boolean> => {
  if (!stripe || !priceId) return false

  try {
    await stripe.prices.retrieve(priceId)
    return true
  } catch (error) {
    console.error(`Invalid price ID: ${priceId}`, error)
    return false
  }
}

export const getAvailablePlans = async () => {
  const plans = { ...PLANS }

  if (!isStripeReady) {
    // Return only free plan if Stripe is not configured
    return { free: plans.free }
  }

  // Validate price IDs if Stripe is configured
  const proPriceValid = await validatePriceId(plans.pro.priceId)
  const enterprisePriceValid = await validatePriceId(plans.enterprise.priceId)

  const availablePlans: Partial<typeof PLANS> = { free: plans.free }

  if (proPriceValid) {
    availablePlans.pro = plans.pro
  }

  if (enterprisePriceValid) {
    availablePlans.enterprise = plans.enterprise
  }

  return availablePlans
}
