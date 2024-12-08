import { auth } from "@/auth"
import { db } from "@/prisma"
import { NextResponse } from "next/server"
import Replicate, { Prediction } from "replicate"
import { supabaseAdmin } from "@/lib/supabase-admin"

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('REPLICATE_API_TOKEN is not set')
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
})

// Add type for prediction input
interface ReplicateInput {
  input_video: string;
  [key: string]: string | number | boolean | null | undefined;
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get all jobs for the user
    const jobs = await db.job.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Check for any stuck processing jobs
    const processingJobs = jobs.filter(job => job.status === "processing")
    
    if (processingJobs.length > 0) {
      const { results: predictions } = await replicate.predictions.list()
      
      for (const job of processingJobs) {
        const matchingPrediction = predictions?.find((pred: Prediction) => {
          const input = pred.input as ReplicateInput
          return input?.input_video?.includes(job.filePath)
        })

        if (matchingPrediction?.status === "succeeded") {
          // Download and save the processed video
          const response = await fetch(matchingPrediction.output)
          if (response.ok) {
            const videoBuffer = Buffer.from(await response.arrayBuffer())
            
            if (videoBuffer.length) {
              // Upload to Supabase
              const processedFileName = `processed/${job.id}/${job.fileName}`
              const { data: uploadData, error: uploadError } = await supabaseAdmin
                .storage
                .from('upload')
                .upload(processedFileName, videoBuffer, {
                  contentType: 'video/mp4',
                  upsert: true
                })

              if (!uploadError && uploadData) {
                // Update job status
                await db.job.update({
                  where: { id: job.id },
                  data: {
                    status: "completed",
                    processedPath: uploadData.path
                  }
                })
              }
            }
          }
        } else if (matchingPrediction?.status === "failed") {
          await db.job.update({
            where: { id: job.id },
            data: {
              status: "failed",
              error: matchingPrediction.error || "Processing failed on Replicate"
            }
          })
        }
      }

      // Refresh jobs after potential updates
      const updatedJobs = await db.job.findMany({
        where: {
          userId: session.user.id
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return NextResponse.json({ jobs: updatedJobs })
    }

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return new NextResponse(
      error instanceof Error ? error.message : "Failed to fetch jobs", 
      { status: 500 }
    )
  }
} 