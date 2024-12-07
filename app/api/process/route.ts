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

type SupabaseUploadResponse = {
  path: string
}


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

    const processPromise = async (): Promise<SupabaseUploadResponse> => {
      // Get a public URL for the uploaded video
      const { data: { publicUrl } } = supabaseAdmin
        .storage
        .from('upload')
        .getPublicUrl(job.filePath)

      console.log('Processing video from URL:', publicUrl)

      // Start the prediction and wait for completion
      const prediction = await replicate.predictions.create({
        version: "73d2128a371922d5d1abf0712a1d974be0e4e2358cc1218e4e34714767232bac",
        input: {
          input_video: publicUrl
        },
      })

      // Wait for the prediction to complete
      let result = await replicate.predictions.get(prediction.id)
      while (result.status === "processing" || result.status === "starting") {
        await new Promise(resolve => setTimeout(resolve, 2000))
        result = await replicate.predictions.get(prediction.id)
      }

      if (result.status !== "succeeded") {
        console.error('Replicate processing failed:', result)
        throw new Error(`Prediction failed: ${result.error || 'Unknown error'}`)
      }

      console.log('Replicate processing succeeded:', result)

      // Download the processed video from Replicate
      const response = await fetch(result.output)
      if (!response.ok) {
        throw new Error(`Failed to download processed video: ${response.statusText}`)
      }

      const videoBuffer = Buffer.from(await response.arrayBuffer())
      
      // Verify buffer
      if (!videoBuffer.length) {
        throw new Error('Received empty video buffer from Replicate')
      }
      console.log('Video buffer size:', videoBuffer.length)

      // Upload to Supabase
      const processedFileName = `processed/${job.id}/${job.fileName}`
      const { data: uploadData, error: uploadError } = await supabaseAdmin
        .storage
        .from('upload')
        .upload(processedFileName, videoBuffer, {
          contentType: 'video/mp4',
          upsert: true,
          duplex: 'half',
          headers: {
            'Content-Length': videoBuffer.length.toString()
          }
        })

      if (uploadError) {
        console.error('Supabase upload error:', uploadError)
        throw new Error(`Failed to upload processed video: ${uploadError.message}`)
      }

      if (!uploadData) {
        throw new Error('No upload data received from Supabase')
      }

      console.log('Successfully uploaded to Supabase:', uploadData)

      return uploadData
    }

    // Add timeout handling - 30 minutes
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Processing timeout after 30 minutes')), 1800000)
    })

    try {
      const uploadData = await Promise.race([processPromise(), timeoutPromise]) as SupabaseUploadResponse

      // Update job with processed video path
      await db.job.update({
        where: { id: jobId },
        data: {
          status: "completed",
          processedPath: uploadData.path
        }
      })

      return NextResponse.json({ 
        success: true,
        processedUrl: uploadData.path
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

  } catch (error) {
    console.error('Processing error:', error)
    return new NextResponse(
      error instanceof Error ? error.message : "Processing failed", 
      { status: 500 }
    )
  }
} 