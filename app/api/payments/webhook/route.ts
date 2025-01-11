import { headers } from 'next/headers'
import { NextResponse } from "next/server"
import { db } from "@/prisma"
import { Webhook } from "standardwebhooks"

const webhook = new Webhook(process.env.DODO_WEBHOOK_SECRET!)

// Add GET handler for testing
export async function GET() {
  return NextResponse.json({ status: 'webhook endpoint ready' })
}

export async function POST(req: Request) {
  console.log('Webhook endpoint hit!', {
    url: req.url,
    method: req.method,
    headers: Object.fromEntries(req.headers)
  })
  
  try {
    const headersList = await headers()
    const rawBody = await req.text()
    
    console.log('Raw webhook body:', rawBody)

    // Log the incoming request for debugging
    console.log('Webhook Request:', {
      headers: {
        'webhook-id': headersList.get('webhook-id'),
        'webhook-signature': headersList.get('webhook-signature'),
        'webhook-timestamp': headersList.get('webhook-timestamp')
      },
      body: rawBody
    })

    const webhookHeaders = {
      "webhook-id": headersList.get("webhook-id") || "",
      "webhook-signature": headersList.get("webhook-signature") || "",
      "webhook-timestamp": headersList.get("webhook-timestamp") || "",
    }

    // Verify webhook using standardwebhooks
    await webhook.verify(rawBody, webhookHeaders)
    
    const event = JSON.parse(rawBody)
    console.log('Webhook event:', event)

    if (event.type === 'payment.succeeded') {
      const payment = await db.payment.findUnique({
        where: { paymentId: event.data.payment_id },
        include: { user: true }
      })

      if (!payment) {
        console.error('Payment not found:', event.data.payment_id)
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
      }

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

      console.log('Credits added for payment:', payment.id)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
} 