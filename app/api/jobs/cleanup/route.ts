import { db } from "@/prisma"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const staleJobs = await db.job.findMany({
      where: {
        status: 'processing',
        updatedAt: {
          lt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes old
        }
      }
    })

    for (const job of staleJobs) {
      await db.job.update({
        where: { id: job.id },
        data: { 
          status: 'failed',
          error: 'Processing timed out'
        }
      })
    }

    return NextResponse.json({ cleaned: staleJobs.length })
  } catch (error) {
    console.error('Cleanup error:', error)
    return new NextResponse("Cleanup failed", { status: 500 })
  }
} 