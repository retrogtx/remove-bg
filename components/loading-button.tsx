"use client"

import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"

interface LoadingButtonProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline"
}

export function LoadingButton({ children, className, variant = "default" }: LoadingButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button 
      type="submit"
      variant={variant}
      disabled={pending}
      className={className}
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : children}
    </Button>
  )
} 