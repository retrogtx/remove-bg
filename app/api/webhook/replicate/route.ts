import { ReadableStreamDefaultController } from 'stream/web'

declare global {
  /* eslint-disable-next-line no-var */
  var eventControllers: Map<string, ReadableStreamDefaultController> | undefined
}

import { supabaseAdmin } from "@/lib/supabase-admin"
import { db } from "@/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Update job status to processing first
    const job = await db.job.update({
      where: { id: body.id },
      data: { status: "processing" }
    })

    if (body.status === "succeeded") {
      // Download the processed video from Replicate
      const response = await fetch(body.output)
      if (!response.ok) {
        throw new Error(`Failed to download processed video: ${response.statusText}`)
      }

      const videoBuffer = Buffer.from(await response.arrayBuffer())
      
      if (!videoBuffer.length) {
        throw new Error('Received empty video buffer from Replicate')
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

      // Update job with success
      await db.job.update({
        where: { id: job.id },
        data: {
          status: "completed",
          processedPath: uploadData.path
        }
      })

      // Notify clients through SSE
      globalThis.eventControllers?.forEach((controller: ReadableStreamDefaultController) => {
        controller.enqueue(
          `data: ${JSON.stringify({
            type: 'job_update',
            job: {
              id: job.id,
              fileName: job.fileName,
              status: "completed",
              processedPath: uploadData.path
            }
          })}\n\n`
        )
      })

    } else if (body.status === "failed") {
      // Handle failure
      await db.job.update({
        where: { id: job.id },
        data: {
          status: "failed",
          error: body.error || "Processing failed"
        }
      })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
} 