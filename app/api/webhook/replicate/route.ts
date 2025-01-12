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
    console.log('========================')
    console.log('WEBHOOK RECEIVED')
    console.log('Headers:', Object.fromEntries(req.headers.entries()))
    
    const body = await req.json()
    console.log('Webhook Body:', JSON.stringify(body, null, 2))
    
    // Find the job using replicateId
    const job = await db.job.findFirst({
      where: { replicateId: body.prediction?.id || body.id }
    })
    console.log('Found job:', job)

    if (!job) {
      console.error('No job found for replicate ID:', body.prediction?.id || body.id)
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    if (body.status === "succeeded") {
      console.log('Processing succeeded, output URL:', body.output)
      // Download the processed video from Replicate
      const response = await fetch(body.output)
      console.log('Download response:', {
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length')
      })

      if (!response.ok) {
        throw new Error(`Failed to download processed video: ${response.statusText}`)
      }

      const videoBuffer = Buffer.from(await response.arrayBuffer())
      console.log('Video buffer size:', videoBuffer.length)
      
      if (!videoBuffer.length) {
        throw new Error('Received empty video buffer from Replicate')
      }

      // Upload to Supabase
      const processedFileName = `processed/${job.id}/${job.fileName}`
      console.log('Uploading to Supabase:', processedFileName)
      
      const { data: uploadData, error: uploadError } = await supabaseAdmin
        .storage
        .from('upload')
        .upload(processedFileName, videoBuffer, {
          contentType: 'video/mp4',
          upsert: true
        })

      if (uploadError) {
        console.error('Supabase upload error:', uploadError)
        throw new Error(`Failed to upload processed video: ${uploadError.message}`)
      }

      console.log('Upload successful:', uploadData)

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