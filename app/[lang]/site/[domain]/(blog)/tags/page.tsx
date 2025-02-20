import { getSite, getTags } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { Metadata } from 'next'

export const dynamic = 'force-static'
export const revalidate = 86400; // 3600 * 24

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>
}): Promise<Metadata> {
  const site = await getSite(await params)
  return {
    title: `Tags | ${site.name}`,
    description: site.description,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ domain: string }>
}) {
  const site = await getSite(await params)
  const tags = await getTags(site.id)
  const { TagListPage } = loadTheme(site.themeName)

  if (!TagListPage) {
    return <div>Theme not found</div>
  }

  return <TagListPage site={site} tags={tags} />
}
