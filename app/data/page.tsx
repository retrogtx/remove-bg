import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { DataTable } from "@/components/data-table"

export default async function DataPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/')
  }
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Data</h1>
        <p className="text-muted-foreground">Manage your uploaded videos</p>
      </div>
      
      <DataTable />
    </div>
  )
}