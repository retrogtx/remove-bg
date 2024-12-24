import { DataTable } from '@/components/data-table'
import { columns } from '@/components/columns'
import { auth } from "@/auth"
import { redirect } from 'next/navigation'
import { getJobs } from '@/lib/jobs'
import { VideoUploader } from "@/components/video-uploader"
import { createBucketIfNotExists } from "@/lib/supabase-admin"
import Signout from '@/components/sign-out'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth')
  }

  await createBucketIfNotExists()

  const jobs = await getJobs(session.user.id)

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Upload videos and remove backgrounds</p>
          </div>
          <Signout />
        </div>
        
        <div className="space-y-10">
          <VideoUploader />
          <DataTable columns={columns} data={jobs} />
        </div>
      </main>
    </div>
  )
}