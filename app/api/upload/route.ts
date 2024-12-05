import { auth } from "@/auth"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { db } from "@/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return new NextResponse("No file provided", { status: 400 })
    }

    // Generate a unique file path
    const fileName = `${session.user.id}/${Date.now()}-${file.name}`

    // Upload directly to Supabase bucket
    const { data, error: storageError } = await supabaseAdmin
      .storage
      .from('upload')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true
      })

    if (storageError || !data) {
      console.error('Storage error:', storageError)
      return new NextResponse("Upload failed: " + storageError.message, { status: 500 })
    }

    // Create job record
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

    return NextResponse.json({ 
      jobId: job.id,
      path: data.path
    })
  } catch (error) {
    console.error('Upload error:', error)
    return new NextResponse(error instanceof Error ? error.message : "Internal error", { status: 500 })
  }
} 