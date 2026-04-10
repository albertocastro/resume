import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft, Shield, MapPinned } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Parkingly Privacy Policy",
  description: "Privacy policy for the Parkingly iOS app",
}

const policySections = [
  {
    title: "Summary",
    items: [
      "No account is required.",
      "Parkingly does not use advertising SDKs.",
      "Parkingly does not use third-party analytics SDKs.",
      "Parkingly does not sync your data to a Parkingly backend in the current version.",
      "Most session data is stored locally on your device.",
      "Some feature-related requests send location data to Apple map services and to Open-Meteo, as described below.",
    ],
  },
  {
    title: "Information Parkingly Processes",
    paragraphs: [
      "Parkingly may process the following information in order to provide the app's core features:",
    ],
    items: [
      "Precise location data, including your parking location and breadcrumb trail while recording a session",
      "Heading and motion-related location context needed to guide you back",
      "Timestamps and location accuracy values",
      "Optional session names, including names you enter or place names resolved from map services",
      "Floor calibration and elevation-related values used for floor estimation",
      "Notification permission status and locally scheduled notification content",
      "Live Activity state shown on the lock screen while a recording session is active",
    ],
  },
  {
    title: "How Your Information Is Used",
    paragraphs: [
      "Parkingly uses this information to:",
    ],
    items: [
      "Record your path after you park",
      "Show your saved session on the map",
      "Help guide you back to your car",
      "Estimate floor level when that feature is used",
      "End a session automatically in certain situations",
      "Show a Live Activity and local notifications related to an active parking session",
    ],
  },
  {
    title: "Where Data Is Stored",
    paragraphs: [
      "Parkingly stores parking sessions, breadcrumbs, timestamps, floor calibrations, and related app data locally on your device using Apple's on-device storage technologies.",
      "Parkingly does not operate its own cloud account system or backend for the current version of the app.",
    ],
  },
  {
    title: "Data Sent Off Device",
    paragraphs: [
      "Although Parkingly is local-first, some requests may send data off your device.",
      "Parkingly uses Apple MapKit services for map-related features such as reverse geocoding. When those features are used, Apple may receive the coordinates needed to return map or place-name results.",
      "Parkingly uses the Open-Meteo Elevation API to estimate terrain elevation for floor-related features. These requests include latitude and longitude coordinates. According to Open-Meteo's published privacy information, it may keep web server log files for troubleshooting that can contain geographical coordinates for up to 90 days.",
    ],
  },
  {
    title: "Background Location",
    paragraphs: [
      "If you start a parking session, Parkingly may continue receiving location updates while the session is actively recording so it can keep saving your breadcrumb trail even if the app is backgrounded. Recording stops automatically after the configured session length or when the session ends.",
    ],
  },
  {
    title: "Notifications and Live Activities",
    paragraphs: [
      "Parkingly may request permission to send local notifications related to active sessions. Parkingly may also display Live Activity information on the lock screen while a session is being recorded.",
    ],
  },
  {
    title: "Sharing",
    paragraphs: [
      "Parkingly does not sell your personal information.",
      "Parkingly does not share your information with advertisers or data brokers.",
      "Parkingly only shares data as needed to provide feature requests you initiate in the app, such as Apple map-service lookups and Open-Meteo elevation requests described above.",
      "When Parkingly uses third-party providers for those limited requests, it does so only for the purpose of servicing the requested feature and expects those providers to handle the data they receive under privacy commitments intended to provide protections comparable to those described in this policy.",
    ],
  },
  {
    title: "Retention",
    paragraphs: [
      "Data stored locally on your device remains there until:",
    ],
    items: [
      "You delete it using the in-app \"Clear my data\" option",
      "You remove the app from your device",
      "You otherwise clear app data through Apple-provided device controls",
    ],
    trailingParagraphs: [
      "External service providers may retain request logs according to their own policies.",
    ],
  },
  {
    title: "Your Choices",
    paragraphs: [
      "You can:",
    ],
    items: [
      "Decline or revoke location permission in iOS Settings",
      "Decline or revoke notification permission in iOS Settings",
      "Stop using floor estimation features if you do not want elevation lookups performed",
      "Delete saved data from the app's Settings screen",
      "Delete the app from your device",
    ],
    trailingParagraphs: [
      "If you revoke location access, key Parkingly features may stop working.",
    ],
  },
  {
    title: "Children's Privacy",
    paragraphs: [
      "Parkingly is not directed to children under 13, and Parkingly is not designed to knowingly collect personal information from children.",
    ],
  },
  {
    title: "Changes to This Policy",
    paragraphs: [
      "This Privacy Policy may be updated from time to time. If the policy changes materially, the updated version will be posted with a new effective date.",
    ],
  },
  {
    title: "Contact",
    paragraphs: [
      "For privacy questions or requests about Parkingly, use the support contact information provided for Parkingly on its App Store product page or support site.",
    ],
  },
]

export default function ParkinglyPrivacyPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,1),_rgba(248,250,252,1))] px-6 py-10 text-foreground dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_22%),linear-gradient(180deg,_rgba(9,12,18,1),_rgba(15,23,42,1))] sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <Button asChild variant="ghost" className="w-fit">
            <Link href="/">
              <ChevronLeft className="size-4" />
              Back to site
            </Link>
          </Button>
        </div>

        <Card className="overflow-hidden border-foreground/10 bg-background/80 shadow-xl backdrop-blur">
          <CardHeader className="gap-5 border-b border-foreground/10 pb-8">
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 px-3 py-1">
                <Shield className="size-3.5" />
                Privacy Policy
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 px-3 py-1">
                <MapPinned className="size-3.5" />
                Parkingly
              </span>
            </div>

            <div className="max-w-3xl space-y-4">
              <CardTitle className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Privacy Policy for Parkingly
              </CardTitle>
              <CardDescription className="text-base leading-7 text-muted-foreground sm:text-lg">
                Effective date: April 9, 2026
              </CardDescription>
              <p className="max-w-2xl text-base leading-7 text-foreground/80 sm:text-lg">
                Parkingly is a parking breadcrumb app that helps you save where you parked and retrace your walking path back to your car.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 py-8">
            {policySections.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-foreground/10 bg-background/70 p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>

                <div className="mt-4 space-y-4 text-sm leading-7 text-foreground/80 sm:text-base">
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}

                  {section.items?.length ? (
                    <ul className="space-y-2 pl-5 marker:text-foreground/50 list-disc">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}

                  {section.trailingParagraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
