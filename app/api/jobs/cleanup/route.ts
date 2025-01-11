import { db } from "@/prisma"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const maxDuration = 60 

export async function POST(req: Request) {
  try {
    const { confirmationCode } = await req.json()
    
    // Require confirmation code that matches current date
    const todayCode = new Date().toISOString().split('T')[0].replace(/-/g, '')
    if (confirmationCode !== `CLEANUP-${todayCode}`) {
      return NextResponse.json({ 
        error: "Invalid confirmation code",
        message: "To run cleanup, pass confirmation code: CLEANUP-YYYYMMDD (today's date)"
      }, { status: 400 })
    }

    // Find both stale processing jobs and old completed jobs in parallel
    const [staleJobs, oldCompletedJobs] = await Promise.all([
      db.job.findMany({
        where: {
          status: 'processing',
          updatedAt: {
            lt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes old
          }
        }
      }),
      db.job.findMany({
        where: {
          status: 'completed',
          updatedAt: {
            lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 7 days old
          }
        },
        select: {
          id: true,
          filePath: true,
          processedPath: true
        }
      })
    ])

    // Handle stale jobs
    const staleUpdates = staleJobs.map(job => 
      db.job.update({
        where: { id: job.id },
        data: { 
          status: 'failed',
          error: 'Processing timed out'
        }
      })
    )
    
    // Handle old completed jobs cleanup
    const storageCleanup = oldCompletedJobs.map(async (job) => {
      const filesToDelete = [
        job.filePath,
        job.processedPath
      ].filter(Boolean) as string[]

      if (filesToDelete.length > 0) {
        await supabaseAdmin.storage
          .from('upload')
          .remove(filesToDelete)
      }

      return db.job.delete({
        where: { id: job.id }
      })
    })

    // Execute all cleanup operations in parallel
    await Promise.allSettled([
      ...staleUpdates,
      ...storageCleanup
    ])

    return NextResponse.json({
      cleaned: {
        staleJobs: staleJobs.length,
        oldCompletedJobs: oldCompletedJobs.length
      }
    })

  } catch (error) {
    console.error('Cleanup error:', error)
    return new NextResponse(
      "Cleanup failed: " + (error instanceof Error ? error.message : "Unknown error"), 
      { status: 500 }
    )
  }
} 