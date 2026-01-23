import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const toBase64 = (value: string) => {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value).toString("base64")
  }
  return value
}

export async function POST(request: NextRequest) {
  const username = process.env.CMS_USERNAME
  const password = process.env.CMS_PASSWORD
  const secret = process.env.CMS_SECRET

  if (!(username && password) && !secret) {
    return new NextResponse("CMS credentials not configured.", { status: 500 })
  }

  let providedUsername = ""
  let providedPassword = ""
  let providedSecret = ""

  try {
    const body = (await request.json()) as {
      username?: string
      password?: string
      secret?: string
    }
    providedUsername = body?.username ?? ""
    providedPassword = body?.password ?? ""
    providedSecret = body?.secret ?? ""
  } catch (error) {
    providedSecret = request.headers.get("x-cms-secret") ?? ""
  }

  const usesUserPass = Boolean(username && password)
  const isAuthorized = usesUserPass
    ? providedUsername === username && providedPassword === password
    : (providedSecret || providedPassword) === secret

  if (!isAuthorized) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const token = usesUserPass ? toBase64(`${username}:${password}`) : (secret ?? "")
  const response = NextResponse.json({ ok: true })
  response.cookies.set("cms-auth", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  })
  return response
}
