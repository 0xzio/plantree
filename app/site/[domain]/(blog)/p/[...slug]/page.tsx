import { PageDefaultUI } from '@/components/theme-ui/PageDefaultUI'
import { getPage, getPost, getPosts, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import prisma from '@/lib/prisma'
import { pageToSlate } from '@/lib/serializer/pageToSlate'
import { Metadata } from 'next'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export async function generateMetadata({
  params,
  ...rest
}: {
  params: any
}): Promise<Metadata> {
  const site = await getSite(params)
  const slug = decodeURI(params.slug.join('/'))
  const page = await getPost(site.id, slug)

  return {
    title: page?.title,
    description: page?.description,
  }
}

// TODO:
export async function generateStaticParams(params: any) {
  const site = await prisma.site.findFirst()
  const pages = site ? await getPosts(site.id) : []
  return pages.map((item) => ({ slug: [item.slug] }))
}

export default async function Page({
  params,
}: {
  params: { domain: string; slug: string[] }
}) {
  const slug = decodeURI(params.slug.join('/'))
  const site = await getSite(params)
  const page = await getPage(site.id, slug)
  const content = pageToSlate(page!)

  const { PageDetail } = loadTheme(site.themeName)
  if (!PageDetail) return <PageDefaultUI content={content} />

  return <PageDetail content={content} page={page} />
}
