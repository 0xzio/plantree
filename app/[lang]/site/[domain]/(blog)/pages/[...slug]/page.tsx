import { PostProvider } from '@/components/PostContext'
import { PageDefaultUI } from '@/components/theme-ui/PageDefaultUI'
import { getPage, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { Metadata } from 'next'

type Params = Promise<{ domain: string; slug: string[]; lang: string }>

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateMetadata(props: {
  params: Params
}): Promise<Metadata> {
  const params = await props.params
  const site = await getSite(params)
  const slug = decodeURI(params.slug.join('/'))
  const page = await getPage(site.id, slug)

  return {
    title: page?.title,
    description: page?.title,
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

  const { PageDetail } = loadTheme(site.themeName)
  if (!PageDetail) return <PageDefaultUI content={page!.content} />

  return (
    <PostProvider post={page as any}>
      <PageDetail content={page!.content} page={page} />
    </PostProvider>
  )
}
