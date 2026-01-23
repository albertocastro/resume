"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const inputClassName =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

export default function AdminAccessPage() {
  const [username, setUsername] = useState("")
  const [secret, setSecret] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/cms/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: secret, secret }),
      })

      if (!response.ok) {
        const message = await response.text()
        setError(message || "Unauthorized")
        return
      }

      router.push("/admin")
    } catch (error) {
      setError("Could not authenticate. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted text-foreground flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-lg p-6 space-y-4">
        <div>
          <h1 className="text-xl font-semibold">Admin Access</h1>
          <p className="text-sm text-muted-foreground">Enter the CMS secret to continue.</p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className={inputClassName}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Password
          </label>
          <input
            type="password"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            className={inputClassName}
          />
          <p className="text-xs text-muted-foreground">
            If username/password are not configured, enter the CMS secret here.
          </p>
        </div>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <Button onClick={handleSubmit} disabled={!secret || loading}>
          {loading ? "Checking..." : "Unlock"}
        </Button>
      </Card>
    </div>
  )
}
