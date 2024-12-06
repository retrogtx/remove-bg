import { auth } from "@/auth"
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

// Add type for Replicate response
type ReplicateResponse = {
  output: string
  error?: string
  // Add other fields if needed
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

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

      console.log('Processing video from URL:', publicUrl) // Debug log

      // Process with Replicate - simplified input structure
      const result = await replicate.run(
        "arielreplicate/robust_video_matting:73d2128a371922d5d1abf0712a1d974be0e4e2358cc1218e4e34714767232bac",
        {
          input: {
            input_video: publicUrl
          }
        }
      ) as ReplicateResponse

      console.log('Replicate output:', result) // Debug log

      // Check for errors in the response
      if (!result || result.error) {
        throw new Error(result.error || 'No output from Replicate')
      }

      // Download the processed video from Replicate using the output URL
      const response = await fetch(result.output)
      if (!response.ok) {
        throw new Error('Failed to download processed video')
      }

      const videoBuffer = Buffer.from(await response.arrayBuffer())

      // Upload to Supabase
      const processedFileName = `processed/${job.id}/${job.fileName}`
      const { data: uploadData, error: uploadError } = await supabaseAdmin
        .storage
        .from('upload')
        .upload(processedFileName, videoBuffer, {
          contentType: 'video/mp4',
          upsert: true
        })

      if (uploadError || !uploadData) {
        throw new Error(`Failed to upload processed video: ${uploadError?.message || 'No upload data'}`)
      }

      return uploadData
    }

    // Add timeout handling - 5 minutes
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Processing timeout after 5 minutes')), 300000)
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