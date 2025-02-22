import { getFriends, getPosts, getSite, getTags } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { Metadata, ResolvingMetadata } from 'next'

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
    title: site.name,
    description: site.description,
  }
}

export default async function HomePage(props: {
  params: Promise<{ domain: string }>
}) {
  const params = await props.params

  const site = await getSite(params)
  const [posts, tags, friends] = await Promise.all([
    getPosts(site.id),
    getTags(site.id),
    getFriends(site.id),
  ])

  const { HomePage } = loadTheme(site.themeName)

  if (!HomePage) {
    return <div>Theme not found</div>
  }

  console.log('=========friends:', friends)

  return (
    <HomePage
      posts={posts}
      tags={tags}
      friends={friends}
      authors={[]}
      site={site}
    />
  )
}
