"use client"

import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from '@/lib/supabase'

interface JobsResponse {
  jobs: Job[]
  metadata: {
    total: number
    page: number
    totalPages: number
  }
}

type Job = {
  id: string
  fileName: string
  filePath: string
  processedPath: string | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error: string | null
}

export function VideoList() {
  const { data, isLoading } = useQuery<JobsResponse>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await fetch('/api/jobs?page=1&limit=10')
      if (!response.ok) throw new Error('Failed to fetch jobs')
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const getVideoUrl = (path: string) => {
    if (!path) return ''
    const { data } = supabase.storage.from('upload').getPublicUrl(path)
    return data.publicUrl
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Videos</h2>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading your videos...</p>
        </div>
      ) : !data?.jobs?.length ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No videos found. Upload one to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {data.jobs.map(job => (
            <div key={job.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{job.fileName}</h3>
                {job.status === 'completed' && job.processedPath && (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => window.open(getVideoUrl(job.processedPath!), '_blank')}
                  >
                    Download
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 