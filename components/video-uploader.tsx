"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Job {
  id: string
  fileName: string
  filePath: string
  processedPath: string | null
  fileSize: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error: string | null
  createdAt: string
  updatedAt: string
}

interface JobsResponse {
  jobs: Job[]
}

// Add output type options
const OUTPUT_TYPES = [
  { label: "Foreground Mask", value: "foreground-mask" },
  { label: "Alpha Mask", value: "alpha-mask" },
  { label: "Green Screen", value: "green-screen" },
] as const

type OutputType = typeof OUTPUT_TYPES[number]["value"]

interface Props {
  remainingCredits: number
}

export function VideoUploader({ remainingCredits }: Props) {
  console.log('VideoUploader mounted with credits:', remainingCredits)

  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null)
  const [outputType, setOutputType] = useState<OutputType>("green-screen")
  const { toast } = useToast()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const validateVideo = useCallback((file: File) => {
    const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
    
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive",
      })
      return false
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload a video smaller than 100MB",
        variant: "destructive",
      })
      return false
    }

    return true
  }, [toast])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const videoFile = files[0]

    if (!videoFile || !validateVideo(videoFile)) return
    setUploadedVideo(videoFile)
  }, [validateVideo])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const videoFile = files[0]

    if (!videoFile || !validateVideo(videoFile)) return
    setUploadedVideo(videoFile)
  }, [validateVideo])

  const handleUpload = async () => {
    if (!uploadedVideo) return

    console.log('Upload attempted with credits:', remainingCredits)
    console.log('Credit check result:', remainingCredits < 1)

    if (remainingCredits < 1) {
      toast({
        title: "Insufficient Credits",
        description: "You need at least 1 credit to process a video.",
      })
      return
    }

    try {
      setIsUploading(true)
      
      // Check if video is already in processing
      const jobsResponse = await fetch('/api/jobs')
      if (!jobsResponse.ok) {
        throw new Error(await jobsResponse.text())
      }
      
      const { jobs } = (await jobsResponse.json()) as JobsResponse
      
      const isDuplicate = jobs.some(job => 
        job.fileName === uploadedVideo.name && 
        ['pending', 'processing'].includes(job.status)
      )

      if (isDuplicate) {
        toast({
          title: "Duplicate Upload",
          description: "This video is already being processed",
        })
        return
      }

      const formData = new FormData()
      formData.append("file", uploadedVideo)
      formData.append("outputType", outputType)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: 'include'
      })

      if (!uploadResponse.ok) {
        throw new Error(await uploadResponse.text())
      }

      await uploadResponse.json()

      toast({
        title: "Upload successful",
        description: "Your video is being processed. You can check its status in the video list.",
      })

      setUploadedVideo(null)
      setUploadProgress(0)
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 sm:p-12 transition-colors h-[200px] sm:h-auto",
          "hover:border-primary/50 hover:bg-muted/50",
          isDragging ? "border-primary bg-primary/5" : "border-border"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center h-full gap-2 sm:gap-4">
          <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
          <div className="text-center">
            <p className="text-base sm:text-lg font-medium">Drag and drop your video here</p>
            <p className="text-xs sm:text-sm text-muted-foreground">MP4, MOV, or AVI up to 100MB</p>
          </div>
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileSelect}
            id="video-upload"
          />
          <Button 
            variant="outline" 
            className="cursor-pointer mt-2"
            asChild
          >
            <label htmlFor="video-upload">
              Select Video
            </label>
          </Button>
        </div>
      </div>

      {uploadedVideo && (
        <div className="mt-4 space-y-3">
          <div className="p-3 sm:p-4 border rounded-lg bg-card">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{uploadedVideo.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedVideo.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto justify-between">
                  <span className="truncate">
                    {OUTPUT_TYPES.find(t => t.value === outputType)?.label}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuLabel>Select Variant</DropdownMenuLabel>
                {OUTPUT_TYPES.map((type) => (
                  <DropdownMenuItem
                    key={type.value}
                    onClick={() => setOutputType(type.value)}
                  >
                    {type.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full sm:w-auto"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload & Process'
              )}
            </Button>
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 