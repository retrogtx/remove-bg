import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { VideoUploader } from "@/components/video-uploader"
import { VideoList } from "@/components/video-list"
import { AppSidebar } from "@/components/app-sidebar"
import { createBucketIfNotExists } from "@/lib/supabase-admin"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/')
  }

  // Create bucket if it doesn't exist
  await createBucketIfNotExists()
  
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Upload videos and remove backgrounds</p>
        </div>
        
        <div className="space-y-10">
          <VideoUploader />
          <VideoList />
        </div>
      </main>
    </div>
  )
}