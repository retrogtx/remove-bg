import { DataTable } from '@/components/data-table'
import { columns } from '@/components/columns'
import { auth } from "@/auth"
import { redirect } from 'next/navigation'
import { getJobs } from '@/lib/jobs'
import { VideoUploader } from "@/components/video-uploader"
import { createBucketIfNotExists } from "@/lib/supabase-admin"
import Signout from '@/components/sign-out'
import { formatISO } from 'date-fns'
import { db } from "@/lib/prisma"
import { BuyCredits } from "@/components/buy-credits"
import { PaymentHistory } from "@/components/payment-history"
import { PaymentSuccessToast } from "@/components/payment-success-toast"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/')
  }

  await createBucketIfNotExists()

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { 
      id: true,
      credits: true 
    }
  })

  const jobs = await getJobs(session.user.id)

  const formattedJobs = jobs.map(job => ({
    ...job,
    createdAt: formatISO(job.createdAt),
    updatedAt: formatISO(job.updatedAt)
  }))

  const payments = await db.payment.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Upload videos and remove backgrounds</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              Credits: {user?.credits ?? 0}
            </span>
            <BuyCredits />
            <Signout />
          </div>
        </div>
        
        <div className="space-y-10">
          <VideoUploader remainingCredits={user?.credits ?? 0} />
          <PaymentHistory payments={payments} />
          <PaymentSuccessToast />
          <DataTable columns={columns} data={formattedJobs} />
        </div>
      </main>
    </div>
  )
}