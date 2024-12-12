import { db } from "@/prisma"
import { NextResponse } from "next/server"
import Replicate, { WebhookEventType } from "replicate"
import { auth } from "@/auth"
import { supabaseAdmin } from "@/lib/supabase-admin"

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('REPLICATE_API_TOKEN is not set')
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error('NEXT_PUBLIC_APP_URL is not set')
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
})

export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { jobId, outputType = "foreground-mask" } = await req.json()
    if (!jobId) {
      return NextResponse.json({ error: "No job ID provided" }, { status: 400 })
    }

    // Get the job and verify ownership
    const job = await db.job.findUnique({
      where: { 
        id: jobId,
        userId: session.user.id
      }
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('upload')
      .getPublicUrl(job.filePath)

    // Update job status to processing
    await db.job.update({
      where: { id: job.id },
      data: { status: "processing" }
    })

    // Remove webhook during development
    const webhookConfig = process.env.NODE_ENV === 'production' 
      ? {
          webhook: process.env.WEBHOOK_URL,
          webhook_events_filter: ["completed"] as WebhookEventType[]
        }
      : {}

    // Start the prediction
    try {
      await replicate.predictions.create({
        version: "73d2128a371922d5d1abf0712a1d974be0e4e2358cc1218e4e34714767232bac",
        input: {
          input_video: publicUrl,
          output_type: outputType
        },
        ...webhookConfig
      })

      return NextResponse.json({ 
        message: "Processing started",
        jobId: job.id 
      }, { status: 202 })

    } catch (error) {
      console.error('Replicate prediction creation error:', error)
      await db.job.update({
        where: { id: job.id },
        data: { 
          status: "failed",
          error: error instanceof Error ? error.message : "Failed to start processing"
        }
      })
      throw error
    }

  } catch (error) {
    console.error('Processing error:', error)
    return NextResponse.json({ 
      error: "Processing failed to start" 
    }, { status: 500 })
  }
} 