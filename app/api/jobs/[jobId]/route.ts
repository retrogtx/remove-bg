import { auth } from "@/auth"
import { db } from "@/prisma"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const params = await context.params
    const jobId = params.jobId
    
    // Get the job to find associated files
    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId: session.user.id
      }
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Delete files from storage
    const filesToDelete = [
      job.filePath,
      job.processedPath
    ].filter(Boolean) as string[]

    if (filesToDelete.length > 0) {
      await supabaseAdmin.storage
        .from('upload')
        .remove(filesToDelete)
    }

    // Delete the job record
    await db.job.delete({
      where: {
        id: jobId,
        userId: session.user.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const job = await db.job.findUnique({
      where: {
        id: params.jobId,
        userId: session.user.id
      }
    })

    return NextResponse.json({ job })
  } catch (error) {
    console.error('Error fetching job:', error)
    return new NextResponse(
      error instanceof Error ? error.message : "Failed to fetch job", 
      { status: 500 }
    )
  }
} 