import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

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
    <main className="min-h-screen px-6 py-10 text-foreground sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to site
        </Link>

        <header className="mt-10 space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Privacy Policy for Parkingly
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Effective date: April 9, 2026
          </p>
          <p className="text-base leading-7 sm:text-lg">
            Parkingly is a parking breadcrumb app that helps you save where you parked and retrace your walking path back to your car.
          </p>
        </header>

        <div className="mt-12 space-y-10">
          {policySections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>

              <div className="mt-4 space-y-4 text-sm leading-7 sm:text-base">
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                {section.items?.length ? (
                  <ul className="list-disc space-y-2 pl-5">
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
        </div>
      </div>
    </main>
  )
}
