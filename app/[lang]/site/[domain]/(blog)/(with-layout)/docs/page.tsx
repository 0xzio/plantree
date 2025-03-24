import { initLingui } from '@/initLingui'
import { POSTS_PER_PAGE } from '@/lib/constants'
import { getPosts, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { AppearanceConfig } from '@/lib/theme.types'
import linguiConfig from '@/lingui.config'
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
    title: `Blog | ${site.seoTitle}`,
    description: site.seoDescription,
  }
}

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ domain: string; lang: string }>
}) {
  const site = await getSite(await params)
  const lang = (await params).lang
  const { appearance } = (site.config || {}) as {
    appearance: AppearanceConfig
  }
  const defaultLocale = appearance?.locale || 'en'
  const locale = lang === 'pseudo' ? defaultLocale : lang
  initLingui(locale)

  const posts = await getPosts(site.id)
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber,
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  const { BlogPage } = loadTheme(site.themeName)

  if (!BlogPage) {
    return <div>Theme not found</div>
  }

  return (
    <BlogPage
      site={site}
      posts={posts}
      authors={[]}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
    />
  )
}
