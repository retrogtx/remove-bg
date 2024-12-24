import { auth } from "@/auth"
import { db } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId: session.user.id,
      },
    })

    if (!job || !job.processedPath) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const { data, error } = await supabase.storage
      .from("upload")
      .createSignedUrl(job.processedPath, 60)

    if (error || !data) {
      console.error("Error creating signed URL:", error)
      return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 })
    }

    return NextResponse.json({ url: data.signedUrl })
  } catch (error) {
    console.error("Error in download route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 