import { NextResponse } from "next/server"
import { db } from "@/prisma"
import { getPaymentStatus } from "@/lib/dodo-payments"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('payment_id')

    if (!paymentId) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=missing-payment`)
    }

    // Find the pending payment in our database
    const payment = await db.payment.findUnique({
      where: { paymentId },
      include: { user: true }
    })

    if (!payment) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=payment-not-found`)
    }

    // Check payment status directly with Dodo
    const dodoPayment = await getPaymentStatus(paymentId);

    if (dodoPayment.status === 'succeeded') {
      console.log('Payment succeeded, updating status and credits...')
      // Update payment status
      await db.payment.update({
        where: { id: payment.id },
        data: { status: 'completed' }
      })

      // Add credits to user
      await db.user.update({
        where: { id: payment.userId },
        data: {
          credits: {
            increment: payment.credits
          }
        }
      })

      console.log(`Added ${payment.credits} credits to user ${payment.userId}`)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`)
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=payment-pending`)
  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=payment-failed`)
  }
} 