import { supabaseAdmin } from "@/lib/supabase-admin"
import { db } from "@/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    if (body.status !== "succeeded") {
      return NextResponse.json({ success: false })
    }

    // Download the processed video from Replicate
    const response = await fetch(body.output)
    if (!response.ok) {
      throw new Error(`Failed to download processed video: ${response.statusText}`)
    }

    const videoBuffer = Buffer.from(await response.arrayBuffer())
    
    // Verify buffer
    if (!videoBuffer.length) {
      throw new Error('Received empty video buffer from Replicate')
    }

    // Get the job ID from the prediction
    const job = await db.job.findFirst({
      where: {
        status: "processing"
      }
    })

    if (!job) {
      throw new Error('No processing job found')
    }

    // Upload to Supabase
    const processedFileName = `processed/${job.id}/${job.fileName}`
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('upload')
      .upload(processedFileName, videoBuffer, {
        contentType: 'video/mp4',
        upsert: true
      })

    if (uploadError) {
      throw new Error(`Failed to upload processed video: ${uploadError.message}`)
    }

    // Update job status
    await db.job.update({
      where: { id: job.id },
      data: {
        status: "completed",
        processedPath: uploadData.path
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new NextResponse(
      error instanceof Error ? error.message : "Webhook processing failed",
      { status: 500 }
    )
  }
} 