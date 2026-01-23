export type ContentStatus = "draft" | "published"

export type ProjectLink = {
  id: string
  label: string
  url: string
}

export type ProjectImage = {
  id: string
  url: string
  alt: string
}

export type Project = {
  id: string
  name: string
  description: string
  skills: string[]
  demo?: string | null
  links?: ProjectLink[]
  images?: ProjectImage[]
  status?: ContentStatus
}

export type Job = {
  id: string
  title: string
  company: string
  period: string
  description: string
  skills: string[]
  projects: Project[]
  status?: ContentStatus
}

export type Bio = {
  markdown: string
  status?: ContentStatus
}

export type CmsContent = {
  bio: Bio
  jobs: Job[]
  updatedAt?: string
}

const ensureArray = <T>(value: T[] | undefined): T[] => (Array.isArray(value) ? value : [])

export const normalizeContent = (content: CmsContent): CmsContent => {
  const normalizedBio: Bio = {
    markdown: content?.bio?.markdown ?? "",
    status: content?.bio?.status ?? "published",
  }

  const normalizedJobs = ensureArray(content?.jobs).map((job) => ({
    ...job,
    description: job.description ?? "",
    skills: ensureArray(job.skills),
    status: job.status ?? "published",
    projects: ensureArray(job.projects).map((project) => ({
      ...project,
      description: project.description ?? "",
      skills: ensureArray(project.skills),
      links: ensureArray(project.links).map((link, index) => ({
        id: link.id ?? `${project.id}-link-${index}`,
        label: link.label ?? "",
        url: link.url ?? "",
      })),
      images: ensureArray(project.images).map((image, index) => ({
        id: image.id ?? `${project.id}-image-${index}`,
        url: image.url ?? "",
        alt: image.alt ?? "",
      })),
      demo: project.demo ?? null,
      status: project.status ?? "published",
    })),
  }))

  return {
    bio: normalizedBio,
    jobs: normalizedJobs,
    updatedAt: content.updatedAt,
  }
}

export const isPublished = (status?: ContentStatus) => status !== "draft"

export const filterPublishedContent = (content: CmsContent): CmsContent => {
  const normalized = normalizeContent(content)
  return {
    ...normalized,
    bio: isPublished(normalized.bio.status)
      ? normalized.bio
      : { ...normalized.bio, markdown: "" },
    jobs: normalized.jobs
      .filter((job) => isPublished(job.status))
      .map((job) => ({
        ...job,
        projects: ensureArray(job.projects).filter((project) => isPublished(project.status)),
      })),
  }
}
