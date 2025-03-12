import { FriendsProvider } from '@/components/FriendsContext'
import { ProjectsProvider } from '@/components/ProjectsContext'
import {
  getFriends,
  getPosts,
  getProjects,
  getSite,
  getTags,
} from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { Metadata } from 'next'

export const dynamic = 'force-static'
// export const revalidate = 86400; // 3600 * 24
export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>
}): Promise<Metadata> {
  const site = await getSite(await params)

  return {
    title: site.seoTitle,
    description: site.seoDescription,
  }
}

export default async function HomePage(props: {
  params: Promise<{ domain: string }>
}) {
  const params = await props.params

  const site = await getSite(params)
  const [posts, tags, friends, projects] = await Promise.all([
    getPosts(site.id),
    getTags(site.id),
    getFriends(site.id),
    getProjects(site.id),
  ])

  const { HomePage } = loadTheme(site.themeName)

  if (!HomePage) {
    return <div>Theme not found</div>
  }

  return (
    <ProjectsProvider projects={projects}>
      <FriendsProvider friends={friends}>
        <HomePage
          posts={posts}
          tags={tags}
          friends={friends}
          projects={projects}
          authors={[]}
          site={site}
        />
      </FriendsProvider>
    </ProjectsProvider>
  )
}
