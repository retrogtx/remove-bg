"use client"

import { useEffect, useState } from 'react'
import { Progress } from "@/components/ui/progress"
import { supabase } from '@/lib/supabase'
import { useToast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

interface JobsResponse {
  jobs: Job[]
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
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { mutate } = useMutation<JobsResponse, Error>({
    mutationFn: async () => {
      const response = await fetch('/api/jobs')
      if (!response.ok) throw new Error('Failed to fetch jobs')
      return response.json() as Promise<JobsResponse>
    },
    onSuccess: (data: JobsResponse) => {
      setJobs(data.jobs)
      setIsLoading(false)
    },
    onError: (error: Error) => {
      console.error('Error fetching jobs:', error)
      toast({
        title: "Error fetching jobs",
        description: error.message || "Please try again",
        variant: "destructive",
      })
      setIsLoading(false)
    },
  })

  useEffect(() => {
    mutate()
    const interval = setInterval(() => mutate(), 5000)
    return () => clearInterval(interval)
  }, [mutate])

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
      ) : jobs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No videos found. Upload one to get started!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map(job => (
            <div key={job.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{job.fileName}</h3>
                <span className={`px-2 py-1 rounded text-sm ${
                  job.status === 'completed' ? 'bg-green-100 text-green-800' :
                  job.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {job.status}
                </span>
              </div>

              {job.status === 'processing' && (
                <div className="space-y-2">
                  <Progress value={undefined} className="mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Processing your video... This may take a few minutes
                  </p>
                </div>
              )}

              {job.status === 'pending' && (
                <p className="text-sm text-muted-foreground text-center">
                  Waiting to start processing...
                </p>
              )}

              {job.error && (
                <p className="text-red-600 text-sm mb-2">{job.error}</p>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {/* Original Video */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Original</p>
                  {job.filePath && (
                    <video 
                      key={job.filePath}
                      src={getVideoUrl(job.filePath)}
                      controls
                      className="w-full rounded"
                    />
                  )}
                </div>

                {/* Processed Video */}
                {job.processedPath && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Processed</p>
                    <video 
                      key={job.processedPath}
                      src={getVideoUrl(job.processedPath)}
                      controls
                      className="w-full rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 