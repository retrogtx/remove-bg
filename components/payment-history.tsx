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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment History</h2>
      <div className="border rounded-lg divide-y">
        {payments.map(payment => (
          <div key={payment.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{payment.credits} Credits</p>
              <p className="text-sm text-gray-500">
                {formattedDates[payment.id] || ''}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">${payment.amount.toFixed(2)}</p>
              <p className={`text-sm ${payment.status === 'completed' ? 'text-green-500' : 'text-gray-500'}`}>
                {payment.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 