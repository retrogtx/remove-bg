'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export function PaymentSuccessToast() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Payment Successful",
        description: "Your credits have been added to your account.",
        variant: "default",
      })
    }
  }, [searchParams, toast])

  return null
} 