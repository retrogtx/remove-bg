import { db } from "@/prisma"
import { NextResponse } from "next/server"
import Replicate from "replicate"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { auth } from "@/auth"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
})

export async function POST(req: Request) {
  try {
    const { adminKey } = await req.json()
    
    // Verify admin access
    if (adminKey !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all processing jobs
    const processingJobs = await db.job.findMany({
      where: {
        userId: session.user.id,
        status: "processing"
      }
    })

    const results = []

    for (const job of processingJobs) {
      // Get predictions from Replicate
      const { results: predictions } = await replicate.predictions.list()
      
      // Find matching prediction by input video URL
      const matchingPrediction = predictions?.find(pred => 
        (pred.input as { input_video?: string })?.input_video?.includes(job.filePath)
      )

      if (matchingPrediction?.status === "succeeded" && matchingPrediction.output) {
        // Download the processed video from Replicate
        const response = await fetch(matchingPrediction.output)
        if (!response.ok) continue

        const videoBuffer = Buffer.from(await response.arrayBuffer())
        
        if (!videoBuffer.length) continue

        // Upload to Supabase
        const processedFileName = `processed/${job.id}/${job.fileName}`
        const { data: uploadData, error: uploadError } = await supabaseAdmin
          .storage
          .from('upload')
          .upload(processedFileName, videoBuffer, {
            contentType: 'video/mp4',
            upsert: true
          })

        if (uploadError) continue

        // Update job status
        await db.job.update({
          where: { id: job.id },
          data: {
            status: "completed",
            processedPath: uploadData.path
          }
        })

        results.push({
          jobId: job.id,
          status: "recovered"
        })
      }
    }

    return NextResponse.json({ recovered: results })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
} 