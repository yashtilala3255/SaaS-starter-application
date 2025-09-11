import { type NextRequest, NextResponse } from "next/server"
import { stripe, isStripeConfigured } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  if (!isStripeConfigured || !stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 })
  }

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const planType = session.metadata?.planType

        if (userId && planType && session.subscription) {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

          // Update subscription in database
          await supabase
            .from("subscriptions")
            .upsert({
              user_id: userId,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscription.id,
              status: "active",
              plan_name: planType,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .select()

          // Log the subscription activation
          await supabase.from("usage_logs").insert({
            user_id: userId,
            action: `Subscribed to ${planType} plan`,
            metadata: { subscription_id: subscription.id },
          })
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by customer ID
        const { data: existingSubscription } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single()

        if (existingSubscription) {
          await supabase
            .from("subscriptions")
            .update({
              status: subscription.status === "active" ? "active" : "inactive",
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq("stripe_customer_id", customerId)
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by customer ID
        const { data: existingSubscription } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single()

        if (existingSubscription) {
          // Downgrade to free plan
          await supabase
            .from("subscriptions")
            .update({
              status: "active",
              plan_name: "free",
              stripe_subscription_id: null,
              current_period_start: null,
              current_period_end: null,
            })
            .eq("stripe_customer_id", customerId)

          // Log the cancellation
          await supabase.from("usage_logs").insert({
            user_id: existingSubscription.user_id,
            action: "Subscription canceled",
            metadata: { subscription_id: subscription.id },
          })
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Find user by customer ID
        const { data: existingSubscription } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single()

        if (existingSubscription) {
          await supabase
            .from("subscriptions")
            .update({
              status: "past_due",
            })
            .eq("stripe_customer_id", customerId)

          // Log the payment failure
          await supabase.from("usage_logs").insert({
            user_id: existingSubscription.user_id,
            action: "Payment failed",
            metadata: { invoice_id: invoice.id },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
