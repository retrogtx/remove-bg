"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Job } from "@/types"
import { formatDistanceToNow } from 'date-fns'
import { Download, Loader2, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { deleteJob } from "@/lib/jobs"
import { useState } from "react"

function ActionCell({ job }: { job: Job }) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this video?')) {
      await deleteJob(job.id)
      window.location.reload()
    }
  }

  return (
    <div className="flex gap-2">
      {job.status === 'completed' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={async () => {
            try {
              setIsDownloading(true)
              const res = await fetch(`/api/download/${job.id}`)
              if (res.ok) {
                const { url } = await res.json()
                window.open(url, '_blank')
              }
            } finally {
              setIsDownloading(false)
            }
          }}
          disabled={isDownloading}
        >
          {isDownloading ? 
            <Loader2 className="h-4 w-4 animate-spin" /> : 
            <Download className="h-4 w-4" />
          }
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "fileName",
    header: "File Name",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return formatDistanceToNow(date, { addSuffix: true })
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className="capitalize">{status}</div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell job={row.original} />
  },
] 