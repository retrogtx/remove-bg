import { auth } from "@/auth"
import { db } from "@/prisma"
import { NextResponse } from "next/server"

// Constants
const MAX_FILE_SIZE = 100 * 1024 * 1024
const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo']

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true }
    })

    if (!user || user.credits < 1) {
      return NextResponse.json({ 
        error: "Insufficient credits",
        code: "INSUFFICIENT_CREDITS"
      }, { status: 402 })
    }

    const userId = session.user.id

    const { filePath, fileName, fileSize, fileType, outputType } = await req.json()
    
    // Validate file metadata
    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 100MB)" }, { status: 400 })
    }

    // Deduct credit
    await db.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 1 } }
    })

    // Create job record
    const job = await db.job.create({
      data: {
        fileName,
        filePath,
        fileSize,
        status: 'pending',
        user: {
          connect: {
            id: userId
          }
        }
      }
    })

    // Get the request URL to determine the origin
    const origin = new URL(req.url).origin

    // Start processing
    try {
      const processResponse = await fetch(`${origin}/api/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': req.headers.get('cookie') || ''
        },
        body: JSON.stringify({ 
          jobId: job.id,
          outputType 
        })
      })

      if (!processResponse.ok) {
        const errorText = await processResponse.text()
        console.error('Process request failed:', processResponse.status, errorText)
        return NextResponse.json({ error: `Failed to start processing: ${errorText}` }, { 
          status: processResponse.status 
        })
      }

      return NextResponse.json({ success: true, jobId: job.id })
    } catch (error) {
      console.error('Failed to start processing:', error)
      return NextResponse.json({ error: 'Failed to start processing' }, { status: 500 })
    }
  } catch (err) {
    const error = err as Error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 