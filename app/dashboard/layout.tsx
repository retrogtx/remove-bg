import { Toaster } from "@/components/ui/toaster"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1">
        {children}
      </main>
      <Toaster />
    </div>
  )
}
