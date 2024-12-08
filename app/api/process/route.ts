import { supabaseAdmin } from "@/lib/supabase-admin"
import { db } from "@/prisma"
import { NextResponse } from "next/server"
import Replicate from "replicate"

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('REPLICATE_API_TOKEN is not set')
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
})

// Increase the maximum duration for the API route
export const maxDuration = 300 // 5 minutes

export async function POST(req: Request) {
  try {
    const { jobId } = await req.json()
    if (!jobId) {
      return new NextResponse("Job ID is required", { status: 400 })
    }

    // Get job details
    const job = await db.job.findUnique({
      where: { id: jobId }
    })

    if (!job) {
      return new NextResponse("Job not found", { status: 404 })
    }

    // Update job status to processing
    await db.job.update({
      where: { id: jobId },
      data: { status: "processing" }
    })

    // Start processing in the background
    const processPromise = async () => {
      try {
        // Get a public URL for the uploaded video
        const { data: { publicUrl } } = supabaseAdmin
          .storage
          .from('upload')
          .getPublicUrl(job.filePath)

        console.log('Processing video from URL:', publicUrl)

        // Start the prediction with both polling and webhook
        const prediction = await replicate.predictions.create({
          version: "73d2128a371922d5d1abf0712a1d974be0e4e2358cc1218e4e34714767232bac",
          input: {
            input_video: publicUrl
          },
          webhook: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/replicate`,
          webhook_events_filter: ["completed"]
        })

        // Poll for completion with timeout
        const MAX_ATTEMPTS = 90 // 3 minutes of polling
        let attempts = 0
        let result = await replicate.predictions.get(prediction.id)

        while (
          (result.status === "processing" || result.status === "starting") && 
          attempts < MAX_ATTEMPTS
        ) {
          await new Promise(resolve => setTimeout(resolve, 2000))
          result = await replicate.predictions.get(prediction.id)
          attempts++
        }

        if (result.status === "succeeded") {
          // Download and process the video directly if we got a quick response
          const response = await fetch(result.output)
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

          // Update job status
          await db.job.update({
            where: { id: job.id },
            data: {
              status: "completed",
              processedPath: uploadData.path
            }
          })

          return NextResponse.json({ 
            success: true,
            processedUrl: uploadData.path
          })
        } else if (result.status === "failed") {
          throw new Error(`Prediction failed: ${result.error || 'Unknown error'}`)
        }

        // If we reach here, the process is taking longer than 3 minutes
        // Return the prediction ID and let the webhook handle it
        return NextResponse.json({ 
          success: true,
          message: "Processing in background",
          predictionId: prediction.id
        })

      } catch (error) {
        console.error('Processing failed:', error)
        
        // Update job status to failed
        await db.job.update({
          where: { id: jobId },
          data: {
            status: "failed",
            error: error instanceof Error ? error.message : "Processing failed"
          }
        })

        throw error
      }
    }

    return processPromise()

  } catch (error) {
    console.error('Processing error:', error)
    return new NextResponse(
      error instanceof Error ? error.message : "Processing failed", 
      { status: 500 }
    )
  }
} 