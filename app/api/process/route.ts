import { db } from "@/prisma"
import { NextResponse } from "next/server"
import Replicate from "replicate"

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('REPLICATE_API_TOKEN is not set')
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
})

export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Create a new job with required fields
    const job = await db.job.create({
      data: {
        fileName: file.name,
        filePath: "", // Will be updated after upload
        fileSize: file.size,
        status: "pending",
        error: null,
        processedPath: null,
        user: {
          connect: { id: userId }
        }
      }
    })

    // Start the prediction in background
    replicate.predictions.create({
      version: "73d2128a371922d5d1abf0712a1d974be0e4e2358cc1218e4e34714767232bac",
      input: {
        input_video: file
      },
      webhook: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/replicate`,
      webhook_events_filter: ["completed"]
    }).catch(console.error)

    return NextResponse.json({ 
      message: "Processing started",
      jobId: job.id 
    }, { status: 202 })

  } catch (error) {
    console.error('Processing error:', error)
    return NextResponse.json({ 
      error: "Processing failed to start" 
    }, { status: 500 })
  }
} 