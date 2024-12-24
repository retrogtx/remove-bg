import { auth } from "@/auth"
import { db } from "@/prisma"
import { NextResponse } from "next/server"
import Replicate, { Prediction } from "replicate"

// Define types for Replicate prediction input
interface ReplicateInput {
  input_video: string;
  output_type?: string;
}

// Define type for Job
interface Job {
  id: string;
  filePath: string;
  status: string;
  error: string | null;
}

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('REPLICATE_API_TOKEN is not set')
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
})

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '10')
    const offset = (page - 1) * limit

    // Get jobs with pagination
    const jobs = await db.job.findMany({
      where: {
        userId: session.user.id
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const total = await db.job.count({
      where: {
        userId: session.user.id
      }
    })

    // Check processing jobs in background
    const processingJobs = jobs.filter(job => job.status === "processing")
    if (processingJobs.length > 0) {
      checkProcessingJobs(processingJobs)
    }

    return NextResponse.json({
      jobs,
      metadata: {
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return new NextResponse(
      error instanceof Error ? error.message : "Failed to fetch jobs", 
      { status: 500 }
    )
  }
}

// Move processing check to background
async function checkProcessingJobs(jobs: Job[]) {
  try {
    const { results: predictions } = await replicate.predictions.list()
    
    for (const job of jobs) {
      const matchingPrediction = predictions?.find((pred: Prediction) => 
        (pred.input as ReplicateInput)?.input_video?.includes(job.filePath)
      )

      if (matchingPrediction?.status === "failed") {
        await db.job.update({
          where: { id: job.id },
          data: {
            status: "failed",
            error: matchingPrediction.error || "Processing failed"
          }
        })
      }
    }
  } catch (error) {
    console.error('Error checking processing jobs:', error)
  }
} 