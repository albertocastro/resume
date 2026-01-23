import { NextResponse, type NextRequest } from "next/server"

const toBase64 = (value: string) => {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value).toString("base64")
  }
  if (typeof btoa !== "undefined") {
    return btoa(value)
  }
  return value
}

const getAuthToken = () => {
  const username = process.env.CMS_USERNAME
  const password = process.env.CMS_PASSWORD
  if (username && password) {
    return toBase64(`${username}:${password}`)
  }
  const secret = process.env.CMS_SECRET
  if (secret) {
    return secret
  }
  return null
}

const isAuthorized = (request: NextRequest) => {
  const token = getAuthToken()
  if (!token) return true
  const cookieAuth = request.cookies.get("cms-auth")?.value
  const cookieSecret = request.cookies.get("cms-secret")?.value
  return cookieAuth === token || cookieSecret === token
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/admin/access")) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/admin") && !isAuthorized(request)) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/access"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
