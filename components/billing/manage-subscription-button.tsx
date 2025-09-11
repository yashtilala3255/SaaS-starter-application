"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export function ManageSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleManageSubscription = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/stripe/create-portal", {
        method: "POST",
      })

      const { url, error } = await response.json()

      if (error) {
        console.error("Portal error:", error)
        return
      }

      window.location.href = url
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleManageSubscription}
      disabled={isLoading}
      variant="outline"
      className="flex items-center gap-2 bg-transparent"
    >
      <ExternalLink className="h-4 w-4" />
      {isLoading ? "Loading..." : "Manage Subscription"}
    </Button>
  )
}
