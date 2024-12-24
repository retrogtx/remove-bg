import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  // Your auth configuration here
  providers: [
    // Add your providers
  ],
  // Add any callbacks or other options
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
