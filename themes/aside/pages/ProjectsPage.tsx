import { ProjectsBlock } from '@/components/theme-ui/ProjectsBlock'
import { Project, Site } from '@/lib/theme.types'

interface Props {
  site: Site
  projects: Project[]
}

export function ProjectsPage({ site, projects }: Props) {
  return <ProjectsBlock site={site} projects={projects} />
}
