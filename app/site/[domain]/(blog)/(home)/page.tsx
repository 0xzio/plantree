import { getPosts, getSite, getTags } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { Metadata, ResolvingMetadata } from 'next'

export const dynamic = 'force-static'
// export const revalidate = 3600 * 24
export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: { domain: string }
}): Promise<Metadata> {
  const site = await getSite(params)

  return {
    title: site.name,
    description: site.description,
  }
}

export default async function HomePage({
  params,
}: {
  params: { domain: string }
}) {
  const site = await getSite(params)
  const posts = await getPosts(site.id)

  const { HomePage } = loadTheme(site.themeName)

  if (!HomePage) {
    return <div>Theme not found</div>
  }

  return <HomePage posts={posts} authors={[]} site={site} />
}
