"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronRight, Code2, Moon, Sun, Monitor, X } from "lucide-react"
import contentSeed from "@/data/content.json"
import { Markdown } from "@/components/markdown"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { CmsContent, Job, Project } from "@/lib/cms"
import { filterPublishedContent, normalizeContent } from "@/lib/cms"

export default function PortfolioShowcase() {
  const [activeJob, setActiveJob] = useState(0)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [isMounted, setIsMounted] = useState(false)
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [isDemoVisible, setIsDemoVisible] = useState(false)
  const [inlineDemoVisibility, setInlineDemoVisibility] = useState<Record<string, boolean>>({})
  const workTimelineRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  const params = useParams<{ project?: string[] }>()
  const projectSlug = params?.project?.[0] ?? null

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

  const handleScrollToWork = () => {
    workTimelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const [content, setContent] = useState<CmsContent>(() =>
    normalizeContent(contentSeed as CmsContent),
  )

  const loadContent = useCallback(async () => {
    try {
      const response = await fetch("/api/cms/content", { cache: "no-store" })
      if (!response.ok) return
      const data = (await response.json()) as CmsContent
      setContent(normalizeContent(data))
    } catch (error) {
      // Fallback to seeded content if the CMS is unavailable.
    }
  }, [])

  useEffect(() => {
    void loadContent()
  }, [loadContent])

  useEffect(() => {
    const handleFocus = () => {
      void loadContent()
    }
    const handleVisibility = () => {
      if (!document.hidden) {
        void loadContent()
      }
    }

    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibility)
    return () => {
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [loadContent])

  const publishedContent = useMemo(() => filterPublishedContent(content), [content])
  const experience = publishedContent.jobs
  const bioMarkdown = publishedContent.bio.markdown

  useEffect(() => {
    if (experience.length === 0) {
      setExpandedJob(null)
      return
    }

    if (activeJob >= experience.length) {
      setActiveJob(0)
    }

    if (!expandedJob || !experience.some((job) => job.id === expandedJob)) {
      setExpandedJob(experience[0].id)
    }
  }, [activeJob, experience, expandedJob])

  const demoRegistry = useMemo<Record<string, React.ComponentType>>(
    () => ({
    }),
    [],
  )

  const projectLookup = useMemo(() => {
    const map = new Map<string, { project: Project; job: Job }>()
    experience.forEach((job) => {
      job.projects.forEach((project) => {
        map.set(project.id, { project, job })
      })
    })
    return map
  }, [experience])

  const openProjectModal = useCallback(
    (projectId: string) => {
      setSelectedProjectId(projectId)
      router.push(`/${projectId}`, { scroll: false })
    },
    [router],
  )

  const closeProjectModal = useCallback(() => {
    setSelectedProjectId(null)
    router.replace("/", { scroll: false })
  }, [router])

  useEffect(() => {
    if (experience.length === 0) return
    if (!projectSlug) {
      setSelectedProjectId(null)
      return
    }

    if (projectLookup.has(projectSlug)) {
      setSelectedProjectId(projectSlug)
    } else {
      router.replace("/", { scroll: false })
      setSelectedProjectId(null)
    }
  }, [experience.length, projectSlug, projectLookup, router])

  useEffect(() => {
    if (!selectedProjectId) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        closeProjectModal()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedProjectId, closeProjectModal])

  useEffect(() => {
    if (!selectedProjectId) return
    const originalStyle = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [selectedProjectId])

  useEffect(() => {
    setIsDemoVisible(false)
  }, [selectedProjectId])

  const toggleInlineDemo = useCallback((projectId: string) => {
    setInlineDemoVisibility((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }))
  }, [])

  const selectedProjectDetails = selectedProjectId ? projectLookup.get(selectedProjectId) ?? null : null
  const SelectedDemoComponent =
    selectedProjectDetails?.project.demo ? demoRegistry[selectedProjectDetails.project.demo] : null


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

  const currentExp = experience[activeJob] ?? experience[0] ?? null

  if (!isMounted) return null
  if (!currentExp) return null

  return (
    <div className="min-h-screen bg-muted text-foreground transition-colors duration-300">
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

      <main className="min-h-screen pt-16 sm:pt-20">
        <section className="mt-6 mb-10 border border-foreground/20 bg-background px-4 pt-6 pb-16 shadow-sm sm:mt-8 sm:mb-12 sm:px-6 sm:pt-8 sm:pb-20 lg:mt-10 lg:mb-16 lg:px-8 lg:pt-10 lg:pb-24 max-w-6xl mx-auto">
          {/* Hero Section */}
          <section id="about" className="pt-4 pb-12 sm:pt-6 sm:pb-14 lg:pt-8 lg:pb-16 border-b border-border relative">
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
                <Markdown
                  content={bioMarkdown}
                  variant="hero"
                  className="mb-6 sm:mb-8 max-w-2xl"
                />
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button className="text-sm" onClick={handleScrollToWork}>
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
          <div ref={workTimelineRef} className="mt-20 sm:mt-28 lg:mt-32" id="work-timeline">
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
                  <Markdown
                    content={currentExp.description}
                    variant="body"
                    className="mb-4 sm:mb-6 max-w-2xl"
                  />
                  <div className="flex flex-wrap gap-2">
                    {currentExp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Projects Grid */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 sm:mb-6">Projects</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {currentExp.projects.map((project) => {
                      const InlineDemoComponent = project.demo ? demoRegistry[project.demo] : null
                      return (
                        <Card
                          key={project.id}
                          className="group overflow-hidden rounded-md border-foreground/20 bg-card p-0 hover:bg-card/80 transition-all cursor-pointer"
                          onClick={() => openProjectModal(project.id)}
                        >
                          <div className="px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4 space-y-2">
                            <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                              <h5 className="text-base sm:text-lg font-semibold leading-tight flex-1">{project.name}</h5>
                              <Code2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            </div>
                            <Markdown
                              content={project.description}
                              variant="compact"
                              className="mb-3 sm:mb-4"
                              paragraphClassName="mb-0"
                            />
                            <div className="flex flex-wrap gap-2">
                              {project.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="inline-flex text-xs px-2 py-1 rounded bg-secondary/50 text-secondary-foreground"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                            {project.demo && InlineDemoComponent && (
                              <div className="space-y-3">
                                <Button
                                  variant="outline"
                                  className="w-full sm:w-auto text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleInlineDemo(project.id)
                                  }}
                                >
                                  {inlineDemoVisibility[project.id] ? "Hide Demo" : "View Demo"}
                                </Button>
                                {inlineDemoVisibility[project.id] && InlineDemoComponent && (
                                  <div className="border border-border rounded-lg bg-secondary/20 p-3 sm:p-4">
                                    <InlineDemoComponent />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Layout - Accordion Style */}
            <div className="lg:hidden space-y-4">
              {experience.map((job) => (
                <Card
                  key={job.id}
                  className="border-foreground/20 bg-card overflow-hidden transition-all cursor-pointer hover:bg-card/80"
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
                        <Markdown content={job.description} variant="body" />
                      </div>

                      {/* Tech Stack */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                          Tech Stack
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-foreground"
                            >
                              {skill}
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
                          {job.projects.map((project) => {
                            const InlineDemoComponent = project.demo ? demoRegistry[project.demo] : null
                            return (
                              <Card
                                key={project.id}
                                className="rounded-md border-foreground/20 bg-background p-0 overflow-hidden transition-all cursor-pointer hover:bg-background/80"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openProjectModal(project.id)
                                }}
                              >
                                <div className="px-3 pt-3 pb-2 sm:px-4 sm:pt-4 sm:pb-3">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <h5 className="text-sm font-semibold mb-1 text-balance">{project.name}</h5>
                                      <Markdown
                                        content={project.description}
                                        variant="compact"
                                        paragraphClassName="line-clamp-2 mb-0"
                                      />
                                    </div>
                                    <Code2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                  </div>
                                </div>

                                {/* Tech Tags */}
                                <div className="px-3 sm:px-4 pb-3 bg-secondary/30 flex flex-wrap gap-1.5">
                                  {project.skills.map((skill) => (
                                    <span
                                      key={skill}
                                      className="inline-flex text-xs px-2 py-0.5 rounded bg-secondary/50 text-secondary-foreground"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                                {project.demo && InlineDemoComponent && (
                                  <div className="p-3 sm:p-4 border-t border-border bg-background">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleInlineDemo(project.id)
                                      }}
                                    >
                                      {inlineDemoVisibility[project.id] ? "Hide Demo" : "View Demo"}
                                    </Button>
                                    {inlineDemoVisibility[project.id] && InlineDemoComponent && (
                                      <div className="mt-3 border border-border rounded-lg bg-secondary/20 p-3">
                                        <InlineDemoComponent />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Card>
                            )
                          })}
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

      {selectedProjectDetails && (
        <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center p-0 sm:p-8">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={closeProjectModal}
            aria-hidden="true"
          />
          <div
            className="relative z-10 w-full h-full sm:h-auto sm:max-w-2xl rounded-none sm:rounded-2xl border border-foreground/20 bg-card shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`project-modal-${selectedProjectDetails.project.id}`}
          >
            <div className="flex items-start justify-between gap-4 px-5 sm:px-6 py-4 border-b border-border/80 flex-shrink-0">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {selectedProjectDetails.job.company} • {selectedProjectDetails.job.period}
                </p>
                <h3
                  id={`project-modal-${selectedProjectDetails.project.id}`}
                  className="text-xl sm:text-2xl font-semibold mt-1 text-balance"
                >
                  {selectedProjectDetails.project.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedProjectDetails.job.title}
                </p>
              </div>
              <button
                onClick={closeProjectModal}
                className="p-2 rounded-full border border-border/60 hover:bg-secondary/50 transition-colors"
                aria-label="Close project details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-5 sm:max-h-[75vh] flex-1 overflow-y-auto">
              <div>
                <Markdown
                  content={selectedProjectDetails.project.description}
                  variant="modal"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedProjectDetails.project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              {selectedProjectDetails.project.links && selectedProjectDetails.project.links.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Links
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProjectDetails.project.links.map((link, index) => (
                      <a
                        key={link.id ?? `${link.url}-${index}`}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition hover:bg-secondary/60"
                      >
                        {link.label || link.url}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
              {selectedProjectDetails.project.images && selectedProjectDetails.project.images.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Gallery
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {selectedProjectDetails.project.images.map((image, index) => (
                      <div
                        key={image.id ?? `${image.url}-${index}`}
                        className="overflow-hidden rounded-xl border border-border bg-secondary/10"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.url}
                          alt={image.alt || "Project image"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {SelectedDemoComponent && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm text-muted-foreground">Want to see it in action?</p>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => setIsDemoVisible((prev) => !prev)}
                    >
                      {isDemoVisible ? "Hide Demo" : "View Demo"}
                    </Button>
                  </div>
                  {isDemoVisible && (
                    <div className="border border-border rounded-xl bg-secondary/20">
                      <SelectedDemoComponent />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border mt-16 sm:mt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2025. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6">
              <a href="https://github.com/albertocastro" target="_blank" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/albertocastroyepiz/" target="_blank" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                LinkedIn
              </a>
            
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
