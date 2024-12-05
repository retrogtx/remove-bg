"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null)
  const { toast } = useToast()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const videoFile = files[0]

    if (!videoFile?.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive",
      })
      return
    }

    setUploadedVideo(videoFile)
  }, [toast])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const videoFile = files[0]

    if (!videoFile?.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive",
      })
      return
    }

    setUploadedVideo(videoFile)
  }, [toast])

  const handleProcess = async () => {
    if (!uploadedVideo) return

    setIsProcessing(true)
    // TODO: Implement video processing with Replicate API
    try {
      // Simulated processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Success!",
        description: "Video processed successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to process video",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="text-lg font-medium">Drag and drop your video here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileSelect}
            id="video-upload"
          />
          <label htmlFor="video-upload">
            <Button variant="outline" className="cursor-pointer">
              Select Video
            </Button>
          </label>
        </div>
      </div>

      {uploadedVideo && (
        <div className="mt-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{uploadedVideo.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedVideo.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <Button 
              onClick={handleProcess}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Remove Background'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 