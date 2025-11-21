"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ChevronRight, Code2, Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function PortfolioShowcase() {
  const [activeJob, setActiveJob] = useState(0)
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [isMounted, setIsMounted] = useState(false)
  const [expandedJob, setExpandedJob] = useState<string | null>("senior-frontend")

  useEffect(() => {
    setIsMounted(true)
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark" | "system") || "system"
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (selectedTheme: "light" | "dark" | "system") => {
    let isDark = false
    if (selectedTheme === "system") {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    } else {
      isDark = selectedTheme === "dark"
    }

    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const setThemeDirectly = (selectedTheme: "light" | "dark" | "system") => {
    setTheme(selectedTheme)
    localStorage.setItem("theme", selectedTheme)
    applyTheme(selectedTheme)
  }

  const experience = [

    {
      "id": "softtek",
      "title": "Software Engineer",
      "company": "Softtek",
      "period": "2014 — TBD",
      "description": "Joined one of Mexico's largest software consulting firms. Details pending interview.",
      "tech": ["Drupal", "PHP", "HTML", "JavaScript", "CSS"],
      "projects": []
    },
    {
      "id": "personal-android-app",
      "title": "Indie Android Developer",
      "company": "Personal Project",
      "period": "2014",
      "description": "Published first Android app, marking the start of personal mobile development interests.",
      "tech": ["Android", "Java"],
      "projects": [
        {
          "id": "first-android-app",
          "name": "First Android App",
          "description": "Personal Android app published on August 9, 2014. Details to be added once specified.",
          "tech": ["Android", "Java"]
        }
      ]
    },
    {
      "id": "taller-ciruela-mobile-lead",
      "title": "Lead Mobile Developer",
      "company": "Taller Ciruela",
      "period": "2014",
      "description": "Led the development of a mobile app for El Valle de Guadalupe. Managed two developers, collaborated with designers, and shaped the overall product direction. Engineered a custom multi-screen navigation system for Cordova before modern frameworks existed.",
      "tech": ["PhoneGap", "Cordova", "JavaScript", "jquery"],
      "projects": [
        {
          "id": "guvapp",
          "name": "Guía del Valle (GuvApp)",
          "description": "Mobile app for discovering places, wineries, restaurants, and activities in El Valle de Guadalupe. Included a full catalog system and custom navigation architecture.",
          "tech": ["PhoneGap", "Cordova", "JavaScript", "jQuery"]
        }
      ]
    },
    {
      "id": "eme-studio",
      "title": "Developer / Designer Support",
      "company": "EME Studio",
      "period": "2013–2014",
      "description": "Split time between two leaders: half focused on a PHP-based ads and promotions platform, and half handling rapid landing page development with vague requirements. Worked across design, backend, and frontend tasks.",
      "tech": ["PHP", "MySQL", "jQuery", "HTML", "CSS", "JavaScript", "Photoshop"],
      "projects": [
        {
          "id": "ads-platform",
          "name": "Ads & Promotions Platform",
          "description": "Maintained and added features to a PHP-MySQL promotional site used for marketing campaigns.",
          "tech": ["PHP", "MySQL"]
        },
        {
          "id": "landing-pages",
          "name": "Marketing Landing Pages",
          "description": "Built multiple landing pages based on rough design direction or loose requirements. Handled layout, styling, and asset preparation.",
          "tech": ["HTML", "CSS", "JavaScript", "jQuery", "Photoshop"]
        }
      ]
    },
    {
      "id": "taller-ciruela-webdev-1",
      "title": "Web Developer",
      "company": "Taller Ciruela",
      "period": "2013",
      "description": "Worked with a designer to turn static visual designs into real websites. Joined shortly after leaving Ingersoll Rand and took on custom website builds for small businesses.",
      "tech": ["HTML", "CSS", "JavaScript", "jQuery"],
      "projects": []
    },
    {
      "id": "ingersoll-rand-intern",
      "title": "Intern – Forecast & Materials Department",
      "company": "Ingersoll Rand (Schlage Division)",
      "period": "2013",
      "description": "Built an internal inventory system from scratch using ASP.NET Web Forms. Gathered requirements directly from the floor manager and created one of the department's first digital tracking tools. This was my introduction to frontend work.",
      "tech": ["ASP.NET", "ASPX", "C#", "HTML", "CSS"],
      "projects": [
        {
          "id": "inventory-system",
          "name": "Inventory Management System",
          "description": "Full internal system for tracking materials and forecasting needs. Designed UI, gathered requirements from operations, and implemented the entire application.",
          "tech": ["ASP.NET Web Forms", "C#", "SQL Server"]
        }
      ]
    }
  ]


  const InteractiveDemo = ({ type }: { type: string }) => {
    const [count, setCount] = useState(0)
    const [filter, setFilter] = useState("all")
    const [stats, setStats] = useState({ views: 12400, users: 893, engagement: 67 })

    const handleDemoInteraction = (callback: (e: React.MouseEvent) => void) => {
      return (e: React.MouseEvent) => {
        e.stopPropagation()
        callback(e)
      }
    }

    switch (type) {
      case "interactive-counter":
        return (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
            <p className="text-sm text-muted-foreground mb-6">Interactive Counter Demo</p>
            <div className="text-4xl sm:text-5xl font-light mb-8 text-balance">{count}</div>
            <div className="flex gap-2 sm:gap-3 flex-wrap justify-center w-full">
              <Button
                variant="outline"
                onClick={handleDemoInteraction(() => setCount(Math.max(0, count - 1)))}
                className="px-4 sm:px-6 text-sm"
              >
                Decrease
              </Button>
              <Button onClick={handleDemoInteraction(() => setCount(count + 1))} className="px-4 sm:px-6 text-sm">
                Increase
              </Button>
            </div>
          </div>
        )
      case "dashboard-stats":
        return (
          <div className="py-8 sm:py-12 px-4 sm:px-6">
            <p className="text-sm text-muted-foreground mb-6 sm:mb-8">Dashboard Stats Demo</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-semibold mb-2">{stats.views.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Page Views</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-semibold mb-2">{stats.users}</div>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-semibold mb-2">{stats.engagement}%</div>
                <p className="text-xs text-muted-foreground">Engagement Rate</p>
              </div>
            </div>
            <Button
              onClick={handleDemoInteraction(() =>
                setStats({
                  views: Math.floor(Math.random() * 50000),
                  users: Math.floor(Math.random() * 5000),
                  engagement: Math.floor(Math.random() * 100),
                }),
              )}
              variant="outline"
              className="w-full text-sm"
            >
              Refresh Data
            </Button>
          </div>
        )
      case "ecommerce-filter":
        return (
          <div className="py-8 sm:py-12 px-4 sm:px-6">
            <p className="text-sm text-muted-foreground mb-4 sm:mb-6">Product Filter Demo</p>
            <div className="flex gap-2 mb-6 sm:mb-8 flex-wrap">
              {["all", "electronics", "fashion", "home"].map((cat) => (
                <Button
                  key={cat}
                  variant={filter === cat ? "default" : "outline"}
                  size="sm"
                  onClick={handleDemoInteraction(() => setFilter(cat))}
                  className="capitalize text-xs"
                >
                  {cat}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-lg bg-secondary/20 flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">Product {i}</p>
                </div>
              ))}
            </div>
          </div>
        )
      case "analytics-chart":
        return (
          <div className="py-8 sm:py-12 px-4 sm:px-6">
            <p className="text-sm text-muted-foreground mb-4 sm:mb-6">Analytics Visualization</p>
            <div className="space-y-4">
              {["Metric A", "Metric B", "Metric C"].map((metric) => (
                <div key={metric}>
                  <p className="text-xs text-muted-foreground mb-2">{metric}</p>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${Math.random() * 100}%`,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case "portfolio-hero":
        return (
          <div className="py-8 sm:py-12 px-4 sm:px-6 text-center">
            <p className="text-sm text-muted-foreground mb-4 sm:mb-6">Portfolio Hero Section</p>
            <h3 className="text-2xl sm:text-3xl font-light mb-4">Minimal & Clean</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              A portfolio that speaks through design and code. Clean, professional, ready to impress.
            </p>
            <Button onClick={handleDemoInteraction(() => { })} className="text-sm">
              View Full Project
            </Button>
          </div>
        )
      case "todo-interactive":
        return (
          <div className="py-8 sm:py-12 px-4 sm:px-6">
            <p className="text-sm text-muted-foreground mb-4 sm:mb-6">Task List Demo</p>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span>Task {i}</span>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const currentExp = experience[activeJob]

  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="text-xl font-semibold tracking-tight">albertocastro.me</div>
          <TooltipProvider>
            <div className="flex gap-1 p-1 bg-secondary rounded-full">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setThemeDirectly("light")}
                    className={`p-2 rounded-full transition-all ${theme === "light" ? "bg-background shadow-sm" : "hover:bg-background/50"
                      }`}
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Light Mode</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setThemeDirectly("dark")}
                    className={`p-2 rounded-full transition-all ${theme === "dark" ? "bg-background shadow-sm" : "hover:bg-background/50"
                      }`}
                  >
                    <Moon className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Dark Mode</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setThemeDirectly("system")}
                    className={`p-2 rounded-full transition-all ${theme === "system" ? "bg-background shadow-sm" : "hover:bg-background/50"
                      }`}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>System Theme</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </nav>

      <main className="min-h-screen">
        <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Hero Section */}
          <section id="about" className="py-16 sm:py-20 lg:py-28 border-b border-border relative">
            <div className="max-w-3xl">
              {/* <div className="flex mb-8 sm:mb-12">
                <div className="w-24 h-24 rounded-full overflow-hidden border border-border bg-secondary/30 flex items-center justify-center flex-shrink-0">
                  <img src="/professional-headshot-engineer.jpg" alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div> */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-4 sm:mb-6 text-balance">
                  Software <span className="font-semibold">Engineer</span>
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-2xl">
                  I’m <span className="font-semibold">Alberto Castro</span>, a front end engineer from Mexico 🇲🇽 now building software in the United States 🇺🇸. I’m happily married and live with my two beautiful cats, who keep life interesting. I work across the stack and enjoy everything from clean UI to backend logic, infrastructure, and turning ideas into real products. This site is where I share the projects I care about and give people an easy way to connect with me, while offering a simple look at who I am and the work I like to create.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button className="text-sm">
                    View My Work
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="bg-transparent text-sm">
                    Get In Touch
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Work Timeline Section */}
          <div className="mt-20 sm:mt-28 lg:mt-32">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight mb-8 sm:mb-12 text-balance">
              Work <span className="font-semibold">Timeline</span>
            </h2>

            {/* Desktop Layout - Side by side */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="grid grid-cols-1 gap-2 sticky top-24">
                  {experience.map((job, idx) => (
                    <button
                      key={job.id}
                      onClick={() => setActiveJob(idx)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm ${activeJob === idx
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                        }`}
                    >
                      <p className="text-sm font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{job.company}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop Job Details & Projects */}
              <div className="lg:col-span-3 space-y-12">
                {/* Job Header */}
                <div>
                  <div className="flex items-start justify-between mb-3 sm:mb-4 flex-col gap-2">
                    <div className="w-full">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        {currentExp.period}
                      </p>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-light mb-1 sm:mb-2">
                        <span className="font-semibold">{currentExp.title}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{currentExp.company}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-6 max-w-2xl">
                    {currentExp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentExp.tech.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Projects Grid */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 sm:mb-6">Projects</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {currentExp.projects.map((project) => (
                      <Card
                        key={project.id}
                        className="group overflow-hidden border-border bg-card hover:bg-card/80 transition-all cursor-pointer"
                      >
                        <div
                          className="p-4 sm:p-6 border-b border-border cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            setExpandedProject(expandedProject === project.id ? null : project.id)
                          }}
                        >
                          <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                            <h5 className="text-base sm:text-lg font-semibold leading-tight flex-1">{project.name}</h5>
                            <Code2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tech.map((t) => (
                              <span
                                key={t}
                                className="inline-flex text-xs px-2 py-1 rounded bg-secondary/50 text-secondary-foreground"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                          {expandedProject !== project.id && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-transparent text-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedProject(project.id)
                              }}
                            >
                              View Demo
                            </Button>
                          )}
                        </div>

                        {/* {expandedProject === project.id  && (
                          <div className="border-t border-border bg-secondary/20">
                            <InteractiveDemo type={project.demo} />
                          </div>
                        )} */}
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Layout - Accordion Style */}
            <div className="lg:hidden space-y-4">
              {experience.map((job) => (
                <Card
                  key={job.id}
                  className="border-border bg-card overflow-hidden transition-all cursor-pointer hover:bg-card/80"
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                >
                  {/* Job Header - Always Visible */}
                  <div className="p-4 sm:p-6 border-b border-border">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          {job.period}
                        </p>
                        <h3 className="text-base sm:text-lg font-semibold mb-1 text-balance">{job.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{job.company}</p>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${expandedJob === job.id ? "rotate-90" : ""
                          }`}
                      />
                    </div>
                  </div>

                  {/* Job Details - Expandable */}
                  {expandedJob === job.id && (
                    <div className="border-t border-border px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 bg-secondary/20">
                      {/* Description */}
                      <div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
                      </div>

                      {/* Tech Stack */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                          Tech Stack
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {job.tech.map((tech) => (
                            <span
                              key={tech}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Projects Accordion */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                          Projects
                        </p>
                        <div className="space-y-3">
                          {job.projects.map((project) => (
                            <Card
                              key={project.id}
                              className="border-border bg-background overflow-hidden transition-all"
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedProject(expandedProject === project.id ? null : project.id)
                              }}
                            >
                              <div className="p-3 sm:p-4 border-b border-border">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-sm font-semibold mb-1 text-balance">{project.name}</h5>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                                  </div>
                                  <ChevronRight
                                    className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${expandedProject === project.id ? "rotate-90" : ""
                                      }`}
                                  />
                                </div>
                              </div>

                              {/* Tech Tags */}
                              <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-border bg-secondary/30 flex flex-wrap gap-1.5">
                                {project.tech.map((t) => (
                                  <span
                                    key={t}
                                    className="inline-flex text-xs px-2 py-0.5 rounded bg-secondary/50 text-secondary-foreground"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>

                              {/* {expandedProject === project.id && (
                                <div className="border-t border-border bg-secondary/10">
                                  <InteractiveDemo type={project.demo} />
                                </div>
                              )} */}
                              {expandedProject !== project.id && (
                                <div className="px-3 sm:px-4 py-2 sm:py-3">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-xs bg-transparent"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setExpandedProject(project.id)
                                    }}
                                  >
                                    View Demo
                                  </Button>
                                </div>
                              )}
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 sm:mt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2025. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6">
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
