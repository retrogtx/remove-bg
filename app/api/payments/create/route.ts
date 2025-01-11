import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { createPayment } from "@/lib/dodo-payments"
import { db } from "@/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!session.user.email || !session.user.name) {
      return NextResponse.json({ error: "User email and name required" }, { status: 400 })
    }

    const { credits } = await req.json()

    if (!credits || credits < 1) {
      return NextResponse.json({ error: "Invalid credit amount" }, { status: 400 })
    }

    // First create payment with Dodo Payments
    const payment = await createPayment({
      payment_link: true, // Important: This creates a hosted checkout page
      customer: {
        email: session.user.email,
        name: session.user.name
      },
      product_cart: [{
        product_id: process.env.DODO_PRODUCT_ID!,
        quantity: 1
      }],
      metadata: {
        userId: session.user.id,
        credits: "25"
      }
    })

    // Then create our database record with the Dodo payment ID
    await db.payment.create({
      data: {
        userId: session.user.id,
        amount: 7.00,
        credits: 25,
        status: 'pending',
        paymentId: payment.payment_id,
        metadata: {
          customerEmail: session.user.email,
          customerName: session.user.name
        }
      }
    })

    return NextResponse.json({
      checkoutUrl: payment.payment_link,
      paymentId: payment.payment_id
    })
  } catch (error) {
    console.error("Payment creation error details:", error)
    return NextResponse.json(
      { error: "Failed to create payment", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
