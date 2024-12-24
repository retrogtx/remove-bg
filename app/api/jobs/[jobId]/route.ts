import { auth } from "@/auth"
import { db } from "@/prisma"
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

    const { jobId } = await context.params

    // Get the job to find associated files
    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId: session.user.id,
      },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Delete the job record
    await db.job.delete({
      where: {
        id: jobId,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { jobId } = await context.params

    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId: session.user.id,
      },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ job })
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch job" },
      { status: 500 }
    )
  }
}
