"use client"

import { useEffect, useState } from 'react'
import { Progress } from "@/components/ui/progress"
import { supabase } from '@/lib/supabase'

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

  useEffect(() => {
    fetchJobs()
    // Refresh every 5 seconds
    const interval = setInterval(fetchJobs, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchJobs = async () => {
    const response = await fetch('/api/jobs')
    if (response.ok) {
      const data = await response.json()
      setJobs(data.jobs)
    }
  }

  const getVideoUrl = (path: string) => {
    if (!path) return ''
    const { data } = supabase.storage.from('upload').getPublicUrl(path)
    return data.publicUrl
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Videos</h2>
      
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
              <Progress value={30} className="mb-2" />
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
    </div>
  )
} 