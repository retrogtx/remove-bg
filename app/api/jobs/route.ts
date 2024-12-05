import { auth } from "@/auth"
import { db } from "@/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const jobs = await db.job.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return new NextResponse(
      error instanceof Error ? error.message : "Failed to fetch jobs", 
      { status: 500 }
    )
  }
} 