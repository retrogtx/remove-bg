"use client"

import { signInAction } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface SignInProps {
  className?: string;
  children?: React.ReactNode;
}

export default function SignIn({ className, children = "Sign In" }: SignInProps) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <form
      action={async () => {
        if (isLoading) return
        setIsLoading(true)
        await signInAction()
      }}
    >
      <Button 
        type="submit"
        disabled={isLoading}
        className={className}
      >
        <div className="flex items-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            children
          )}
        </div>
      </Button>
    </form>
  )
} 