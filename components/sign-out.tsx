import { signOut } from "@/auth"
import { Button } from "@/components/ui/button"

async function handleSignOut() {
  "use server"
  await signOut()
}

export default function SignOut() {
  return (
    <form action={handleSignOut}>
      <Button variant="outline">
        Sign Out
      </Button>
    </form>
  )
}