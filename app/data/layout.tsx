import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import SignOut from "@/components/sign-out"

export default function DataLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-4 flex justify-between items-center border-b">
            <SidebarTrigger />
            <SignOut />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
