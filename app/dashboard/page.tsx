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
    <div className="min-h-screen">
      <main className="p-2 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold">Dashboard</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Remove backgrounds</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm">
                  Credits: {user?.credits ?? 0}
                </span>
                <BuyCredits />
                <Signout />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <VideoUploader remainingCredits={user?.credits ?? 0} />
            
            <div className="border rounded-lg p-2 sm:p-4">
              <h2 className="text-sm sm:text-lg font-semibold mb-2">File History</h2>
              <div className="overflow-x-auto -mx-2">
                <DataTable columns={columns} data={formattedJobs} />
              </div>
            </div>
            
            <div className="border rounded-lg p-2 sm:p-4">
              <h2 className="text-sm sm:text-lg font-semibold mb-2">Payment History</h2>
              <PaymentHistory payments={payments} />
            </div>
            
            <PaymentSuccessToast />
          </div>
        </div>
      </main>
    </div>
  )
}