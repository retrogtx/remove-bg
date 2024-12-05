"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export function VideoUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
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

  const validateVideo = (file: File) => {
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
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const videoFile = files[0]

    if (!videoFile || !validateVideo(videoFile)) return
    setUploadedVideo(videoFile)
  }, [toast])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const videoFile = files[0]

    if (!videoFile || !validateVideo(videoFile)) return
    setUploadedVideo(videoFile)
  }, [toast])

  const handleUpload = async () => {
    if (!uploadedVideo) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", uploadedVideo)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      toast({
        title: "Upload successful",
        description: "Your video is being processed",
      })

      // Reset state
      setUploadedVideo(null)
      setUploadProgress(0)
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-12 transition-colors",
          "hover:border-primary/50 hover:bg-muted/50",
          isDragging ? "border-primary bg-primary/5" : "border-border"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div className="text-center">
            <p className="text-lg font-medium">Drag and drop your video here</p>
            <p className="text-sm text-muted-foreground">MP4, MOV, or AVI up to 100MB</p>
          </div>
          <div className="mt-4">
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileSelect}
              id="video-upload"
            />
            <Button 
              variant="outline" 
              className="cursor-pointer"
              asChild
            >
              <label htmlFor="video-upload">
                Select Video
              </label>
            </Button>
          </div>
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
              onClick={handleUpload}
              disabled={isUploading}
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
            <div className="mt-4">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 