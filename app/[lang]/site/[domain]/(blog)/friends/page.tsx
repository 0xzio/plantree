import { FriendsProvider } from '@/components/FriendsContext'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import { getFriends, getPage, getSite } from '@/lib/fetchers'
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
    title: `Friends | ${site.name}`,
    description: site.description,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ domain: string }>
}) {
  const site = await getSite(await params)
  const friends = await getFriends(site.id)

  const page = await getPage(site.id, 'friend-links')

  return (
    <FriendsProvider friends={friends}>
      <ContentRender content={page!.content} />
    </FriendsProvider>
  )
}
