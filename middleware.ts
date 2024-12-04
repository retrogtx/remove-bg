import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAuthPage = req.nextUrl.pathname === "/"
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")

  if (isLoggedIn && isOnAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if (!isLoggedIn && isOnDashboard) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/', '/dashboard/:path*']
}