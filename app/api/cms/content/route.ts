import { NextRequest, NextResponse } from "next/server"
import type { CmsContent } from "@/lib/cms"
import { filterPublishedContent, normalizeContent } from "@/lib/cms"
import { isDatabaseConfigured, loadCmsContent, saveCmsContent } from "@/lib/db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const toBase64 = (value: string) => {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value).toString("base64")
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
  const headerSecret = request.headers.get("x-cms-secret")
  const cookieAuth = request.cookies.get("cms-auth")?.value
  const cookieSecret = request.cookies.get("cms-secret")?.value
  return headerSecret === token || cookieAuth === token || cookieSecret === token
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const mode = url.searchParams.get("mode")
  const wantsDrafts = mode === "drafts"

  if (wantsDrafts && !isAuthorized(request)) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const content = await loadCmsContent()
  const payload = wantsDrafts ? content : filterPublishedContent(content)
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store",
    },
  })
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  if (!isDatabaseConfigured()) {
    return new NextResponse("Database not configured.", { status: 500 })
  }

  const body = (await request.json()) as CmsContent
  const normalized = normalizeContent(body)
  const payload = await saveCmsContent(normalized)

  return NextResponse.json(payload)
}
