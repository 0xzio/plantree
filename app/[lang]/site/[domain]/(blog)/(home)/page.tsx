import { FriendsProvider } from '@/components/FriendsContext'
import { ProjectsProvider } from '@/components/ProjectsContext'
import { initLingui } from '@/initLingui'
import {
  getFriends,
  getPage,
  getPosts,
  getProjects,
  getSite,
  getTags,
} from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { AppearanceConfig } from '@/lib/theme.types'
import { Metadata } from 'next'

type Params = Promise<{ domain: string; lang: string }>

export const dynamic = 'force-static'
// export const revalidate = 86400; // 3600 * 24
export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const site = await getSite(await params)

  return {
    title: site.seoTitle,
    description: site.seoDescription,
  }
}

export default async function HomePage(props: {
  params: Promise<{ domain: string; lang: string }>
}) {
  const params = await props.params
  const site = await getSite(params)
  const { appearance } = (site.config || {}) as {
    appearance: AppearanceConfig
  }
  const lang = params.lang
  const defaultLocale = appearance?.locale || 'en'
  const locale = lang === 'pseudo' ? defaultLocale : lang

  initLingui(locale)

  const [posts, tags, friends, projects, about] = await Promise.all([
    getPosts(site.id),
    getTags(site.id),
    getFriends(site.id),
    getProjects(site.id),
    getPage(site.id, 'about'),
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
          about={about}
        />
      </FriendsProvider>
    </ProjectsProvider>
  )
}
