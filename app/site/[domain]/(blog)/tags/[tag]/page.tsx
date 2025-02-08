import { getSite, getTags, getTagWithPost } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import prisma from '@/lib/prisma'
import { Metadata } from 'next'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export async function generateMetadata({
  params,
}: {
  params: { domain: string }
}): Promise<Metadata> {
  const site = await getSite(params)
  return {
    title: `Tags | ${site.name}`,
    description: site.description,
  }
}

// TODO:
export const generateStaticParams = async (params: any) => {
  const site = await prisma.site.findFirst()
  const tags = site ? await getTags(site.id) : []
  const paths = tags.map((tag) => ({
    tag: encodeURI(tag.name),
  }))
  return paths
}

export default async function TagPage({
  params,
}: {
  params: { tag: string; domain: string }
}) {
  const tagName = decodeURI(params.tag)

  const site = await getSite(params)
  const [tagWithPosts, tags] = await Promise.all([
    getTagWithPost(site.id, tagName),
    getTags(site.id),
  ])

  const posts = tagWithPosts?.postTags.map((postTag) => postTag.post) || []

  const { TagDetailPage } = loadTheme(site.themeName)

  return <TagDetailPage site={site} posts={posts} tags={tags} />
}
