"use client"

import { formatDistance } from "date-fns"
import { useEffect, useState } from "react"

interface Payment {
  id: string
  amount: number
  credits: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  createdAt: Date
}

export function PaymentHistory({ payments }: { payments: Payment[] }) {
  const [formattedDates, setFormattedDates] = useState<{[key: string]: string}>({})

  // Format dates only on client side
  useEffect(() => {
    const dates = payments.reduce((acc, payment) => ({
      ...acc,
      [payment.id]: formatDistance(new Date(payment.createdAt), new Date(), { addSuffix: true })
    }), {})
    setFormattedDates(dates)
  }, [payments])

  return (
    <div className="w-full">
      <div className="divide-y border rounded-lg max-h-[120px] sm:max-h-[150px] overflow-y-auto text-xs sm:text-sm">
        {payments.map(payment => (
          <div key={payment.id} className="p-1.5 sm:p-2 flex justify-between items-center">
            <div>
              <p className="font-medium text-[10px] sm:text-sm">{payment.credits} Credits</p>
              <p className="text-[8px] sm:text-xs text-gray-500">
                {formattedDates[payment.id] || ''}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-[10px] sm:text-sm">${payment.amount.toFixed(2)}</p>
              <p className={`text-[8px] sm:text-xs ${payment.status === 'completed' ? 'text-green-500' : 'text-gray-500'}`}>
                {payment.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 