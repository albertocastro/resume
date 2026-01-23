import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { randomUUID } from "crypto"
import { put } from "@vercel/blob"

export const runtime = "nodejs"

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

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return new NextResponse("Blob storage not configured.", { status: 500 })
    }
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || typeof file === "string") {
      return new NextResponse("Missing file", { status: 400 })
    }

    const extension = path.extname(file.name || "")
    const fileName = `${Date.now()}-${randomUUID()}${extension}`
    const blob = await put(`cms/${fileName}`, file, { access: "public" })

    return NextResponse.json({
      url: blob.url,
    })
  } catch (error) {
    return new NextResponse("Upload failed", { status: 500 })
  }
}
