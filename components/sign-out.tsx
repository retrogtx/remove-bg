"use client"

import { signOutAction } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function SignOut() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <form
      action={async () => {
        if (isLoading) return
        setIsLoading(true)
        await signOutAction()
      }}
    >
      <Button 
        type="submit"
        variant="outline" 
        disabled={isLoading}
        className="min-w-[100px]"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Sign Out"
        )}
      </Button>
    </form>
  )
}