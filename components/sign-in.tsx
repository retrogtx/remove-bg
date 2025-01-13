import { handleSignIn } from "@/app/actions/auth"
import { LoadingButton } from "@/components/loading-button"
import Image from "next/image"

export default function SignIn() {
  return (
    <form action={handleSignIn}>
      <LoadingButton>
        <div className="flex items-center gap-2">
          <Image src="/google.svg" alt="" width={20} height={20} />
          Sign In with Google
        </div>
      </LoadingButton>
    </form>
  )
} 