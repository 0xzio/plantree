import { FriendsProvider } from '@/components/FriendsContext'
import { ProjectsProvider } from '@/components/ProjectsContext'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import { editorDefaultValue } from '@/lib/constants'
import { getPage, getProjects, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { Metadata } from 'next'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>
}): Promise<Metadata> {
  const site = await getSite(await params)
  return {
    title: `Projects | ${site.name}`,
    description: site.description,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ domain: string }>
}) {
  const site = await getSite(await params)
  const projects = await getProjects(site.id)
  const page = await getPage(site.id, 'projects')

  return (
    <div className="mx-auto max-w-3xl">
      <ProjectsProvider projects={projects}>
        <ContentRender content={page?.content || editorDefaultValue} />
      </ProjectsProvider>
    </div>
  )
}
