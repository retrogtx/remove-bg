"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function BuyCredits() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleBuyCredits = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credits: 10 }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment")
      }

      const { checkoutUrl } = await response.json()
      window.location.href = checkoutUrl
      
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Error",
        description: "Failed to initiate payment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleBuyCredits}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>Buy 25 Credits ($7.00)</>
      )}
    </Button>
  )
} 