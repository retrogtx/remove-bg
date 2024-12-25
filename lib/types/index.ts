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