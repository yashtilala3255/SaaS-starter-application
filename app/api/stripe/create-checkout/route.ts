import { type NextRequest, NextResponse } from "next/server"
import { stripe, PLANS, isStripeConfigured } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured || !stripe) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 })
    }

    const { planType } = await request.json()
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate plan type
    if (!planType || !(planType in PLANS)) {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 })
    }

    const plan = PLANS[planType as keyof typeof PLANS]

    if (!plan.priceId) {
      return NextResponse.json({ error: "Plan not available for checkout" }, { status: 400 })
    }

    try {
      await stripe.prices.retrieve(plan.priceId)
    } catch (priceError) {
      console.error(`Invalid Stripe price ID: ${plan.priceId}`, priceError)
      return NextResponse.json(
        {
          error: `Invalid price configuration for ${plan.name} plan. Please contact support.`,
        },
        { status: 400 },
      )
    }

    // Get or create customer
    let customerId: string

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single()

    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id

      // Update subscription record with customer ID
      await supabase
        .from("subscriptions")
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          status: "inactive",
          plan_name: "free",
        })
        .select()
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${request.nextUrl.origin}/dashboard/billing?success=true`,
      cancel_url: `${request.nextUrl.origin}/dashboard/billing?canceled=true`,
      metadata: {
        userId: user.id,
        planType,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: `Payment system error: ${error.message}`,
        },
        { status: 400 },
      )
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
