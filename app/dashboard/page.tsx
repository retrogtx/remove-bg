import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/")
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />

        <SidebarInset>
          <div className="container mx-auto p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Welcome back, {session.user?.name}</h1>
              <p className="text-muted-foreground mt-2">Start by uploading a video to remove its background</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Stats Cards */}
              <div className="rounded-lg border bg-card p-6">
                <div className="text-sm font-medium text-muted-foreground">Total Videos</div>
                <div className="mt-2 text-2xl font-bold">0</div>
              </div>
              
              <div className="rounded-lg border bg-card p-6">
                <div className="text-sm font-medium text-muted-foreground">Processing</div>
                <div className="mt-2 text-2xl font-bold">0</div>
              </div>
              
              <div className="rounded-lg border bg-card p-6">
                <div className="text-sm font-medium text-muted-foreground">Completed</div>
                <div className="mt-2 text-2xl font-bold">0</div>
              </div>
            </div>

            {/* Recent Videos Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Recent Videos</h2>
              <div className="rounded-lg border">
                <div className="p-8 text-center text-muted-foreground">
                  <Upload className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No videos yet</h3>
                  <p className="mb-4">Upload your first video to get started</p>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Video
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
} 