import { auth } from "@/auth"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { db } from "@/prisma"
import { NextResponse } from "next/server"

// Constants
const MAX_FILE_SIZE = 100 * 1024 * 1024
const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo']

export async function POST(req: Request) {
  try {
    const session = await auth()
    console.log('Session:', session) // Debug session

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!session.user) {
      return new NextResponse("No user found", { status: 401 })
    }

    const userId = session.user.id
    if (!userId) {
      return new NextResponse("No user ID found", { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    
    // Validate file
    if (!file || !ALLOWED_TYPES.includes(file.type)) {
      return new NextResponse("Invalid file type", { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return new NextResponse("File too large (max 100MB)", { status: 400 })
    }

    // 1. Upload original video to Supabase
    const fileName = `${userId}/${Date.now()}-${file.name}`
    const { data, error } = await supabaseAdmin
      .storage
      .from('upload')
      .upload(fileName, file)

    if (error) {
      console.error('Supabase upload error:', error)
      return new NextResponse(error.message, { status: 500 })
    }

    if (!data?.path) {
      return new NextResponse("Upload failed: No file path", { status: 500 })
    }

    // 2. Create job record
    const job = await db.job.create({
      data: {
        fileName: file.name,
        filePath: data.path,
        fileSize: file.size,
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

    // 3. Start processing
    try {
      const processResponse = await fetch(`${origin}/api/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobId: job.id })
      })

      if (!processResponse.ok) {
        const errorText = await processResponse.text()
        console.error('Process request failed:', processResponse.status, errorText)
        return new NextResponse(`Failed to start processing: ${errorText}`, { 
          status: processResponse.status 
        })
      }

      // Processing started successfully
      return NextResponse.json({ success: true, jobId: job.id })
    } catch (error) {
      console.error('Failed to start processing:', error)
      return new NextResponse('Failed to start processing', { status: 500 })
    }
  } catch (err) {
    const error = err as Error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 