import { auth } from "@/auth"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { db } from "@/prisma"
import { NextResponse } from "next/server"

// Constants
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo']

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
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
    const fileName = `${session.user.id}/${Date.now()}-${file.name}`
    const { data, error } = await supabaseAdmin
      .storage
      .from('upload')
      .upload(fileName, file)

    if (error) {
      return new NextResponse(error.message, { status: 500 })
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
            id: session.user.id
          }
        }
      }
    })

    // Get the request URL to determine the origin
    const origin = new URL(req.url).origin

    // 3. Start processing
    fetch(`${origin}/api/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ jobId: job.id })
    }).catch(console.error)

    return NextResponse.json({ success: true, jobId: job.id })
  } catch (err) {
    const error = err as Error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 