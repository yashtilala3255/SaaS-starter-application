"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { loadStripe } from "@stripe/stripe-js"
import { useToast } from "@/hooks/use-toast"

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

interface CheckoutButtonProps {
  planType: string
  children: React.ReactNode
  disabled?: boolean
}

export function CheckoutButton({ planType, children, disabled }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCheckout = async () => {
    if (!stripePromise) {
      toast({
        title: "Payment system unavailable",
        description: "Stripe is not configured. Please contact support.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planType }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        toast({
          title: "Checkout failed",
          description: error,
          variant: "destructive",
        })
        return
      }

      const stripe = await stripePromise
      if (stripe) {
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId })
        if (stripeError) {
          toast({
            title: "Redirect failed",
            description: stripeError.message || "Failed to redirect to checkout",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Unexpected error",
        description: "Something went wrong. Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isDisabled = disabled || isLoading || !stripePromise

  return (
    <Button onClick={handleCheckout} disabled={isDisabled} className="w-full">
      {isLoading ? "Loading..." : children}
    </Button>
  )
}
