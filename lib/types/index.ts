export interface Job {
  id: string
  userId: string
  fileName: string
  filePath: string
  processedPath: string | null
  fileSize: number
  status: string
  error: string | null
  createdAt: string
  updatedAt: string
}

export type JobUpdate = {
  type: 'job_update'
  job: {
    id: string
    fileName: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    processedPath?: string | null
  }
} 