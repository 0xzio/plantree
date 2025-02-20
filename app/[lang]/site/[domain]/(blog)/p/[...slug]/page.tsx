import { PageDefaultUI } from '@/components/theme-ui/PageDefaultUI'
import {
  getFirstSite,
  getPage,
  getPost,
  getPosts,
  getSite,
} from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { pageToSlate } from '@/lib/serializer/pageToSlate'
import { Metadata } from 'next'

type Params = Promise<{ domain: string; slug: string[] }>

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateMetadata(props: {
  params: Params
}): Promise<Metadata> {
  const params = await props.params
  const site = await getSite(params)
  const slug = decodeURI(params.slug.join('/'))
  const page = await getPost(site.id, slug)

  return {
    title: page?.title,
    description: page?.description,
  }
}

export async function generateStaticParams() {
  return []
}

export default async function Page(props: { params: Params }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const site = await getSite(params)
  const page = await getPage(site.id, slug)
  const content = pageToSlate(page!)

  const { PageDetail } = loadTheme(site.themeName)
  if (!PageDetail) return <PageDefaultUI content={content} />

  return <PageDetail content={content} page={page} />
}
