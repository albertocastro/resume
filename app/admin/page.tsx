"use client"

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type DragEvent,
  type MouseEvent,
} from "react"
import { ChevronRight, Monitor, Moon, Sun } from "lucide-react"
import { Toaster, toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MarkdownEditor } from "@/components/cms/markdown-editor"
import type { CmsContent, ContentStatus, Job, Project, ProjectImage, ProjectLink } from "@/lib/cms"
import { normalizeContent } from "@/lib/cms"
import { cn } from "@/lib/utils"

const inputClassName =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

const labelClassName = "text-xs font-semibold uppercase tracking-wide text-muted-foreground"

const emptyHeaders: Record<string, string> = {}

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const formatList = (items: string[]) => items.join(", ")

const parseList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

const createJob = (): Job => ({
  id: createId(),
  title: "",
  company: "",
  period: "",
  description: "",
  skills: [],
  status: "draft",
  projects: [],
})

const createProject = (): Project => ({
  id: createId(),
  name: "",
  description: "",
  skills: [],
  status: "draft",
  demo: null,
  links: [],
  images: [],
})

const createLink = (): ProjectLink => ({
  id: createId(),
  label: "",
  url: "",
})

const createImage = (url = ""): ProjectImage => ({
  id: createId(),
  url,
  alt: "",
})

const statusOptions: ContentStatus[] = ["draft", "published"]

type ProjectCardProps = {
  jobId: string
  project: Project
  statusOptions: ContentStatus[]
  onUpdateProject: (jobId: string, projectId: string, updater: (project: Project) => Project) => void
  onRemoveProject: (jobId: string, projectId: string) => void
  onUploadImage: (jobId: string, projectId: string, file: File) => void
}

const ProjectCard = memo(function ProjectCard({
  jobId,
  project,
  statusOptions,
  onUpdateProject,
  onRemoveProject,
  onUploadImage,
}: ProjectCardProps) {
  const handleProjectStatusChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) =>
      onUpdateProject(jobId, project.id, (current) => ({
        ...current,
        status: event.target.value as ContentStatus,
      })),
    [jobId, onUpdateProject, project.id],
  )

  const handleProjectNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onUpdateProject(jobId, project.id, (current) => ({
        ...current,
        name: event.target.value,
      })),
    [jobId, onUpdateProject, project.id],
  )

  const handleProjectIdChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onUpdateProject(jobId, project.id, (current) => ({
        ...current,
        id: event.target.value,
      })),
    [jobId, onUpdateProject, project.id],
  )

  const handleProjectSkillsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onUpdateProject(jobId, project.id, (current) => ({
        ...current,
        skills: parseList(event.target.value),
      })),
    [jobId, onUpdateProject, project.id],
  )

  const handleProjectDescriptionChange = useCallback(
    (next: string) =>
      onUpdateProject(jobId, project.id, (current) => ({
        ...current,
        description: next,
      })),
    [jobId, onUpdateProject, project.id],
  )

  const handleRemoveProject = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      onRemoveProject(jobId, project.id)
    },
    [jobId, onRemoveProject, project.id],
  )

  const handleAddLink = useCallback(
    () =>
      onUpdateProject(jobId, project.id, (current) => ({
        ...current,
        links: [...(current.links ?? []), createLink()],
      })),
    [jobId, onUpdateProject, project.id],
  )

  const handleLinkLabelChange = useCallback(
    (linkIndex: number, value: string) =>
      onUpdateProject(jobId, project.id, (current) => ({
        ...current,
        links: (current.links ?? []).map((item, idx) =>
          idx === linkIndex ? { ...item, label: value } : item,
        ),
      })),
    [jobId, onUpdateProject, project.id],
  )

  const handleLinkUrlChange = useCallback(
    (linkIndex: number, value: string) =>
      onUpdateProject(jobId, project.id, (current) => ({
        ...current,
        links: (current.links ?? []).map((item, idx) =>
          idx === linkIndex ? { ...item, url: value } : item,
        ),
      })),
    [jobId, onUpdateProject, project.id],
  )

  const handleRemoveLink = useCallback(
    (linkIndex: number) =>
      onUpdateProject(jobId, project.id, (current) => ({
        ...current,
        links: (current.links ?? []).filter((_, idx) => idx !== linkIndex),
      })),
    [jobId, onUpdateProject, project.id],
  )

  const handleImageUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        void onUploadImage(jobId, project.id, file)
      }
      event.currentTarget.value = ""
    },
    [jobId, onUploadImage, project.id],
  )

  const handleImageUrlChange = useCallback(
    (imageIndex: number, value: string) =>
      onUpdateProject(jobId, project.id, (current) => ({
        ...current,
        images: (current.images ?? []).map((item, idx) =>
          idx === imageIndex ? { ...item, url: value } : item,
        ),
      })),
    [jobId, onUpdateProject, project.id],
  )

  const handleImageAltChange = useCallback(
    (imageIndex: number, value: string) =>
      onUpdateProject(jobId, project.id, (current) => ({
        ...current,
        images: (current.images ?? []).map((item, idx) =>
          idx === imageIndex ? { ...item, alt: value } : item,
        ),
      })),
    [jobId, onUpdateProject, project.id],
  )

  const handleRemoveImage = useCallback(
    (imageIndex: number) =>
      onUpdateProject(jobId, project.id, (current) => ({
        ...current,
        images: (current.images ?? []).filter((_, idx) => idx !== imageIndex),
      })),
    [jobId, onUpdateProject, project.id],
  )

  return (
    <Card className="rounded-lg border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md">
      <details className="group">
        <summary className="list-none cursor-pointer px-4 py-3 flex flex-wrap items-center justify-between gap-3 rounded-lg transition hover:bg-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <div className="flex items-center gap-3">
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {project.name || "Untitled project"}
              </p>
              <p className="text-xs text-muted-foreground">ID: {project.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={project.status ?? "draft"}
              onChange={handleProjectStatusChange}
              className={cn(inputClassName, "w-auto")}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={handleRemoveProject}>
              Remove
            </Button>
          </div>
        </summary>
        <div className="border-t border-border/60 bg-muted/50 p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className={labelClassName}>Name</label>
              <input value={project.name} onChange={handleProjectNameChange} className={inputClassName} />
            </div>
            <div className="space-y-2">
              <label className={labelClassName}>Slug</label>
              <input
                value={project.id}
                onChange={handleProjectIdChange}
                className={inputClassName}
                placeholder="project-slug"
              />
            </div>
            <div className="space-y-2">
              <label className={labelClassName}>Skills</label>
              <input
                value={formatList(project.skills)}
                onChange={handleProjectSkillsChange}
                className={inputClassName}
                placeholder="React, AWS"
              />
            </div>
          </div>

          <MarkdownEditor
            label="Project Description"
            value={project.description}
            onChange={handleProjectDescriptionChange}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Links</p>
                <p className="text-xs text-muted-foreground">
                  Add live demos, repositories, or case studies.
                </p>
              </div>
              <Button variant="outline" onClick={handleAddLink}>
                Add Link
              </Button>
            </div>
            <div className="space-y-3">
              {(project.links ?? []).map((link, linkIndex) => (
                <div key={link.id} className="grid gap-3 sm:grid-cols-3">
                  <input
                    value={link.label}
                    onChange={(event) => handleLinkLabelChange(linkIndex, event.target.value)}
                    className={inputClassName}
                    placeholder="Label"
                  />
                  <input
                    value={link.url}
                    onChange={(event) => handleLinkUrlChange(linkIndex, event.target.value)}
                    className={cn(inputClassName, "sm:col-span-2")}
                    placeholder="https://"
                  />
                  <div className="sm:col-span-3">
                    <Button variant="outline" onClick={() => handleRemoveLink(linkIndex)}>
                      Remove Link
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Images</p>
                <p className="text-xs text-muted-foreground">
                  Upload screenshots or mockups to attach to the project.
                </p>
              </div>
              <label className={cn(inputClassName, "w-auto cursor-pointer")}>
                Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <div className="space-y-4">
              {(project.images ?? []).map((image, imageIndex) => (
                <div key={image.id} className="grid gap-3 sm:grid-cols-[120px_1fr]">
                  <div className="h-24 w-full overflow-hidden rounded-lg border border-border bg-secondary/30">
                    {image.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image.url}
                        alt={image.alt || "Project image"}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <input
                      value={image.url}
                      onChange={(event) => handleImageUrlChange(imageIndex, event.target.value)}
                      className={inputClassName}
                      placeholder="Image URL"
                    />
                    <input
                      value={image.alt}
                      onChange={(event) => handleImageAltChange(imageIndex, event.target.value)}
                      className={inputClassName}
                      placeholder="Alt text"
                    />
                    <Button variant="outline" onClick={() => handleRemoveImage(imageIndex)}>
                      Remove Image
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </details>
    </Card>
  )
})

ProjectCard.displayName = "ProjectCard"

type JobCardProps = {
  job: Job
  jobIndex: number
  statusOptions: ContentStatus[]
  isDragged: boolean
  isDragOver: boolean
  isExpanded: boolean
  onDragStart: (event: DragEvent, jobId: string) => void
  onDragOver: (event: DragEvent, jobId: string) => void
  onDragLeave: (jobId: string) => void
  onDrop: (event: DragEvent, jobId: string) => void
  onDragEnd: () => void
  onToggle: (jobId: string, isOpen: boolean) => void
  onRemove: (jobId: string) => void
  onUpdate: (jobId: string, updater: (job: Job) => Job) => void
  onAddProject: (jobId: string) => void
  onRemoveProject: (jobId: string, projectId: string) => void
  onUpdateProject: (jobId: string, projectId: string, updater: (project: Project) => Project) => void
  onUploadImage: (jobId: string, projectId: string, file: File) => void
}

const JobCard = memo(function JobCard({
  job,
  jobIndex,
  statusOptions,
  isDragged,
  isDragOver,
  isExpanded,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onToggle,
  onRemove,
  onUpdate,
  onAddProject,
  onRemoveProject,
  onUpdateProject,
  onUploadImage,
}: JobCardProps) {
  const isDraft = (job.status ?? "draft") === "draft"

  const handleJobStatusChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) =>
      onUpdate(job.id, (current) => ({
        ...current,
        status: event.target.value as ContentStatus,
      })),
    [job.id, onUpdate],
  )

  const handleJobTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onUpdate(job.id, (current) => ({
        ...current,
        title: event.target.value,
      })),
    [job.id, onUpdate],
  )

  const handleJobCompanyChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onUpdate(job.id, (current) => ({
        ...current,
        company: event.target.value,
      })),
    [job.id, onUpdate],
  )

  const handleJobPeriodChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onUpdate(job.id, (current) => ({
        ...current,
        period: event.target.value,
      })),
    [job.id, onUpdate],
  )

  const handleJobIdChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onUpdate(job.id, (current) => ({
        ...current,
        id: event.target.value,
      })),
    [job.id, onUpdate],
  )

  const handleJobSkillsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onUpdate(job.id, (current) => ({
        ...current,
        skills: parseList(event.target.value),
      })),
    [job.id, onUpdate],
  )

  const handleJobDescriptionChange = useCallback(
    (next: string) =>
      onUpdate(job.id, (current) => ({
        ...current,
        description: next,
      })),
    [job.id, onUpdate],
  )

  const handleRemoveJob = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      onRemove(job.id)
    },
    [job.id, onRemove],
  )

  const handleAddProject = useCallback(() => onAddProject(job.id), [job.id, onAddProject])

  return (
    <Card
      className={cn(
        "rounded-lg border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md",
        isDraft ? "border-dashed border-primary/30 bg-primary/5" : "",
        isDragged ? "opacity-70" : "",
        isDragOver ? "ring-2 ring-ring/40" : "",
      )}
      onDragOver={(event) => onDragOver(event, job.id)}
      onDrop={(event) => onDrop(event, job.id)}
      onDragLeave={() => onDragLeave(job.id)}
    >
      <details
        className="group"
        open={isExpanded}
        onToggle={(event) => onToggle(job.id, (event.currentTarget as HTMLDetailsElement).open)}
      >
        <summary
          className="list-none cursor-grab px-5 py-4 flex flex-wrap items-center justify-between gap-3 rounded-lg transition hover:bg-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
          draggable
          onDragStart={(event) => onDragStart(event, job.id)}
          onDragEnd={onDragEnd}
        >
          <div className="flex items-center gap-3">
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {job.title || "Untitled role"}
              </p>
              <p className="text-xs text-muted-foreground">
                {job.company || "Company"} {job.period ? `- ${job.period}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={job.status ?? "draft"}
              onChange={handleJobStatusChange}
              className={cn(inputClassName, "w-auto")}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={handleRemoveJob}>
              Remove
            </Button>
          </div>
        </summary>
        <div className="border-t border-border/60 bg-muted/50 p-5 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className={labelClassName}>Title</label>
              <input value={job.title} onChange={handleJobTitleChange} className={inputClassName} />
            </div>
            <div className="space-y-2">
              <label className={labelClassName}>Company</label>
              <input
                value={job.company}
                onChange={handleJobCompanyChange}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <label className={labelClassName}>Period</label>
              <input value={job.period} onChange={handleJobPeriodChange} className={inputClassName} />
            </div>
            <div className="space-y-2">
              <label className={labelClassName}>Slug</label>
              <input
                value={job.id}
                onChange={handleJobIdChange}
                className={inputClassName}
                placeholder="job-slug"
              />
            </div>
            <div className="space-y-2">
              <label className={labelClassName}>Skills</label>
              <input
                value={formatList(job.skills)}
                onChange={handleJobSkillsChange}
                className={inputClassName}
                placeholder="React, TypeScript, AWS"
              />
            </div>
          </div>

          <MarkdownEditor
            label="Role Description"
            value={job.description}
            onChange={handleJobDescriptionChange}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Projects</h3>
              <Button variant="outline" onClick={handleAddProject}>
                Add Project
              </Button>
            </div>

            <div className="space-y-4">
              {job.projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  jobId={job.id}
                  project={project}
                  statusOptions={statusOptions}
                  onUpdateProject={onUpdateProject}
                  onRemoveProject={onRemoveProject}
                  onUploadImage={onUploadImage}
                />
              ))}
            </div>
          </div>
        </div>
      </details>
    </Card>
  )
})

JobCard.displayName = "JobCard"

export default function AdminPage() {
  const [content, setContent] = useState<CmsContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [authRequired, setAuthRequired] = useState(false)
  const [secret, setSecret] = useState("")
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null)
  const [dragOverJobId, setDragOverJobId] = useState<string | null>(null)
  const [openJobIds, setOpenJobIds] = useState<string[] | null>(null)

  const authHeader = useMemo(
    () => (secret ? { "x-cms-secret": secret } : emptyHeaders),
    [secret],
  )

  const loadContent = useCallback(async (nextSecret?: string) => {
    setLoading(true)
    const headers: Record<string, string> = nextSecret ? { "x-cms-secret": nextSecret } : {}
    try {
      const response = await fetch("/api/cms/content?mode=drafts", { headers })
      if (response.status === 401) {
        setAuthRequired(true)
        setLoading(false)
        return
      }
      const data = (await response.json()) as CmsContent
      setContent(normalizeContent(data))
      setAuthRequired(false)
    } catch (error) {
      toast.error("Could not load content.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const savedSecret = window.localStorage.getItem("cms-secret") ?? ""
    setSecret(savedSecret)
    loadContent(savedSecret)
  }, [loadContent])

  useEffect(() => {
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

  const handleSecretSubmit = async () => {
    window.localStorage.setItem("cms-secret", secret)
    await loadContent(secret)
  }

  const handleSave = async () => {
    if (!content) return
    setSaving(true)
    try {
      const response = await fetch("/api/cms/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
        body: JSON.stringify(content),
      })
      if (response.status === 401) {
        setAuthRequired(true)
        toast.error("Authorization required.")
        return
      }
      if (!response.ok) {
        const message = await response.text()
        toast.error(message || "Save failed. Try again.")
        return
      }
      const data = (await response.json()) as CmsContent
      setContent(normalizeContent(data))
      toast.success("Saved.")
    } catch (error) {
      toast.error("Save failed. Try again.")
    } finally {
      setSaving(false)
    }
  }


  const updateContent = useCallback((updater: (current: CmsContent) => CmsContent) => {
    setContent((prev) => (prev ? updater(prev) : prev))
  }, [])

  const updateJob = useCallback(
    (jobId: string, updater: (job: Job) => Job) => {
      updateContent((current) => ({
        ...current,
        jobs: current.jobs.map((job) => (job.id === jobId ? updater(job) : job)),
      }))
    },
    [updateContent],
  )

  const updateProject = useCallback(
    (jobId: string, projectId: string, updater: (project: Project) => Project) => {
      updateJob(jobId, (job) => ({
        ...job,
        projects: job.projects.map((project) =>
          project.id === projectId ? updater(project) : project,
        ),
      }))
    },
    [updateJob],
  )

  const addJob = useCallback(() => {
    const newJob = createJob()
    updateContent((current) => ({
      ...current,
      jobs: [newJob, ...current.jobs],
    }))
    setOpenJobIds((prev) => {
      const next = new Set(prev ?? [])
      next.add(newJob.id)
      return Array.from(next)
    })
  }, [updateContent])

  const removeJob = useCallback(
    (jobId: string) => {
      updateContent((current) => ({
        ...current,
        jobs: current.jobs.filter((job) => job.id !== jobId),
      }))
      setOpenJobIds((prev) => {
        if (!prev) return prev
        return prev.filter((id) => id !== jobId)
      })
    },
    [updateContent],
  )

  const handleBioChange = useCallback(
    (next: string) =>
      updateContent((current) => ({
        ...current,
        bio: { ...current.bio, markdown: next },
      })),
    [updateContent],
  )

  const reorderJobs = (jobs: Job[], sourceId: string, targetId: string) => {
    const fromIndex = jobs.findIndex((job) => job.id === sourceId)
    const toIndex = jobs.findIndex((job) => job.id === targetId)
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return jobs
    const next = [...jobs]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    return next
  }

  const handleJobDragStart = useCallback((event: DragEvent, jobId: string) => {
    setDraggedJobId(jobId)
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", jobId)
  }, [])

  const handleJobDragOver = useCallback(
    (event: DragEvent, jobId: string) => {
      if (!draggedJobId || draggedJobId === jobId) return
      event.preventDefault()
      event.dataTransfer.dropEffect = "move"
      setDragOverJobId(jobId)
    },
    [draggedJobId],
  )

  const handleJobDrop = useCallback(
    (event: DragEvent, jobId: string) => {
      event.preventDefault()
      const sourceId = draggedJobId ?? event.dataTransfer.getData("text/plain")
      if (!sourceId || sourceId === jobId) {
        setDragOverJobId(null)
        return
      }
      updateContent((current) => ({
        ...current,
        jobs: reorderJobs(current.jobs, sourceId, jobId),
      }))
      setDragOverJobId(null)
      setDraggedJobId(null)
    },
    [draggedJobId, updateContent],
  )

  const handleJobDragLeave = useCallback((jobId: string) => {
    setDragOverJobId((current) => (current === jobId ? null : current))
  }, [])

  const handleJobDragEnd = useCallback(() => {
    setDraggedJobId(null)
    setDragOverJobId(null)
  }, [])

  const handleJobToggle = useCallback((jobId: string, isOpen: boolean) => {
    setOpenJobIds((prev) => {
      const next = new Set(prev ?? [])
      if (isOpen) {
        next.add(jobId)
      } else {
        next.delete(jobId)
      }
      return Array.from(next)
    })
  }, [])

  const addProject = useCallback(
    (jobId: string) => {
      updateJob(jobId, (job) => ({
        ...job,
        projects: [...job.projects, createProject()],
      }))
    },
    [updateJob],
  )

  const removeProject = useCallback(
    (jobId: string, projectId: string) => {
      updateJob(jobId, (job) => ({
        ...job,
        projects: job.projects.filter((project) => project.id !== projectId),
      }))
    },
    [updateJob],
  )

  const uploadImage = useCallback(
    async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch("/api/cms/upload", {
        method: "POST",
        headers: {
          ...authHeader,
        },
        body: formData,
      })
      if (!response.ok) {
        throw new Error("Upload failed")
      }
      const data = (await response.json()) as { url: string }
      return data.url
    },
    [authHeader],
  )

  const handleImageUpload = useCallback(
    async (jobId: string, projectId: string, file: File) => {
      try {
        const url = await uploadImage(file)
        updateProject(jobId, projectId, (project) => ({
          ...project,
          images: [...(project.images ?? []), createImage(url)],
        }))
      } catch (error) {
        toast.error("Image upload failed.")
      }
    },
    [updateProject, uploadImage],
  )

  useEffect(() => {
    if (openJobIds !== null) return
    if (!content?.jobs?.length) return
    setOpenJobIds([content.jobs[0].id])
  }, [content, openJobIds])

  if (loading && !content) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading CMS...</p>
      </div>
    )
  }

  if (authRequired && !content) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <Card className="w-full max-w-md rounded-lg p-6 space-y-4">
          <div>
            <h1 className="text-xl font-semibold">CMS Access</h1>
            <p className="text-sm text-muted-foreground">Enter the CMS secret to continue.</p>
          </div>
          <div className="space-y-2">
            <label className={labelClassName}>CMS Secret</label>
            <input
              type="password"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              className={inputClassName}
            />
          </div>
          <Button onClick={handleSecretSubmit}>Unlock</Button>
        </Card>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No content loaded.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted text-foreground">
      <Toaster position="top-right" richColors />
      <div className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">Resume CMS</h1>
              <p className="text-sm text-muted-foreground">
                Edit your bio, roles, and projects in a rich editor that saves markdown.
              </p>
              <p className="text-xs text-muted-foreground">Draft items stay hidden on the live site.</p>
              {content.updatedAt ? (
                <p className="text-xs text-muted-foreground">Last saved: {content.updatedAt}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <TooltipProvider>
                <div className="flex gap-1 rounded-full bg-secondary/70 p-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setThemeDirectly("light")}
                        className={`rounded-full p-2 transition-all ${
                          theme === "light" ? "bg-background shadow-sm" : "hover:bg-background/60"
                        }`}
                      >
                        <Sun className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Light Mode</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setThemeDirectly("dark")}
                        className={`rounded-full p-2 transition-all ${
                          theme === "dark" ? "bg-background shadow-sm" : "hover:bg-background/60"
                        }`}
                      >
                        <Moon className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Dark Mode</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setThemeDirectly("system")}
                        className={`rounded-full p-2 transition-all ${
                          theme === "system" ? "bg-background shadow-sm" : "hover:bg-background/60"
                        }`}
                      >
                        <Monitor className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>System Theme</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => loadContent(secret)}>
                  Reload
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </header>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Bio</h2>
            <div className="flex items-center gap-3">
              <label className={labelClassName}>Status</label>
              <select
                value={content.bio.status ?? "draft"}
                onChange={(event) =>
                  updateContent((current) => ({
                    ...current,
                    bio: { ...current.bio, status: event.target.value as ContentStatus },
                  }))
                }
                className={cn(inputClassName, "w-auto")}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Card className="rounded-lg border-border/60 bg-card p-6 shadow-sm">
            <MarkdownEditor
              label="Intro Bio"
              hint="This content appears in the hero section of the site."
              value={content.bio.markdown}
              onChange={handleBioChange}
            />
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Jobs</h2>
            <Button variant="outline" onClick={addJob}>
              Add Job
            </Button>
          </div>
          <div className="space-y-4">
            {content.jobs.map((job, jobIndex) => (
              <JobCard
                key={job.id}
                job={job}
                jobIndex={jobIndex}
                statusOptions={statusOptions}
                isDragged={draggedJobId === job.id}
                isDragOver={dragOverJobId === job.id}
                isExpanded={
                  openJobIds ? openJobIds.includes(job.id) : jobIndex === 0
                }
                onDragStart={handleJobDragStart}
                onDragOver={handleJobDragOver}
                onDragLeave={handleJobDragLeave}
                onDrop={handleJobDrop}
                onDragEnd={handleJobDragEnd}
                onToggle={handleJobToggle}
                onRemove={removeJob}
                onUpdate={updateJob}
                onAddProject={addProject}
                onRemoveProject={removeProject}
                onUpdateProject={updateProject}
                onUploadImage={handleImageUpload}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
