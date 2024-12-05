import { auth } from "@/auth"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { db } from "@/prisma"
import { NextResponse } from "next/server"
import Replicate from "replicate"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

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

    // Get video URL from Supabase
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('upload')
      .getPublicUrl(job.filePath)

    // Start Replicate video background removal
    const output = await replicate.run(
      "arielreplicate/robust_video_matting:73d2128a371922d5d1abf0712a1d974be0e4e2358cc1218e4e34714767232bac",
      {
        input: {
          input_video: publicUrl
        }
      }
    )

    if (!output) {
      throw new Error("Processing failed - no output received")
    }

    // Download processed video from Replicate and upload to Supabase
    const response = await fetch(output as unknown as string)
    const processedVideo = await response.blob()
    
    const processedFileName = `processed/${job.id}/${job.fileName}`
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('upload')
      .upload(processedFileName, processedVideo, {
        contentType: 'video/mp4',
        upsert: true
      })

    if (uploadError) {
      throw new Error(`Failed to upload processed video: ${uploadError.message}`)
    }

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
    console.error('Processing error:', error)
    
    // Update job status to failed
    if (req.body && (await req.json()).jobId) {
      await db.job.update({
        where: { id: (await req.json()).jobId },
        data: {
          status: "failed",
          error: error instanceof Error ? error.message : "Processing failed"
        }
      })
    }

    return new NextResponse(
      error instanceof Error ? error.message : "Processing failed", 
      { status: 500 }
    )
  }
} 