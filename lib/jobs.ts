import { db } from "@/lib/prisma"

export async function deleteJob(jobId: string) {
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    throw new Error('Failed to delete job')
  }
  
  return response.json()
}

export async function getJobs(userId: string) {
  const jobs = await db.job.findMany({
    where: {
      userId: userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  return jobs
} 