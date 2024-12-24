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
  context: { params: { jobId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const job = await db.job.findUnique({
      where: {
        id: context.params.jobId,
        userId: session.user.id,
      },
    })

    if (!job || !job.processedPath) {
      return new NextResponse("Not found", { status: 404 })
    }

    const { data, error } = await supabase.storage
      .from("upload")
      .createSignedUrl(job.processedPath, 60) // URL valid for 60 seconds

    if (error || !data) {
      console.error("Error creating signed URL:", error)
      return new NextResponse("Failed to generate download URL", { status: 500 })
    }

    return NextResponse.json({ url: data.signedUrl })
  } catch (error) {
    console.error("Error in download route:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
} 