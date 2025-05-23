import { ContentRender } from '@/components/theme-ui/ContentRender'
import { Footer } from '@/components/theme-ui/Footer'
import { PageTitle } from '@/components/theme-ui/PageTitle'
import { PostActions } from '@/components/theme-ui/PostActions'
import { PostMetadata } from '@/components/theme-ui/PostMetadata'
import { PostSubtitle } from '@/components/theme-ui/PostSubtitle'
import { Toc } from '@/components/theme-ui/Toc'
import { initLingui } from '@/initLingui'
import { getPost, getPosts, getSeries, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { AppearanceConfig } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { GateType, Post, SeriesType } from '@prisma/client'
import { produce } from 'immer'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import readingTime from 'reading-time'

type Params = Promise<{
  domain: string
  slug: string
  lang: string
  postSlug: string
}>

function getContent(post: Post) {
  try {
    const content = JSON.parse(post.content || '[]')
    return content
  } catch (error) {
    return post.content
  }
}

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

// export async function generateMetadata(props: {
//   params: Promise<Params>
// }): Promise<Metadata> {
//   const params = await props.params
//   const site = await getSite(params)
//   const slug = decodeURI(params.slug.join('/'))
//   const post = await getPost(site.id, slug)
//   return {
//     title: post?.title || site.seoTitle,
//     description: post?.description || site.seoDescription,
//   }
// }

// TODO:
export async function generateStaticParams() {
  return []
}

export default async function Page(props: { params: Params }) {
  const params = await props.params

  const site = await getSite(params)
  const { appearance } = (site.config || {}) as {
    appearance: AppearanceConfig
  }
  const lang = params.lang
  const defaultLocale = appearance?.locale || 'en'
  const locale = lang === 'pseudo' ? defaultLocale : lang

  initLingui(locale)

  const postSlug = decodeURI(params.postSlug)
  const [rawPost, series] = await Promise.all([
    getPost(site.id, postSlug),
    getSeries(site.id, params.slug),
  ])

  if (!rawPost) {
    return notFound()
  }

  const post: any = produce(rawPost, (draft) => {
    draft.content = JSON.parse(draft.content)
    ;(draft as any).readingTime = readingTime(draft.content)
    return draft
  })

  return (
    <div className="flex gap-x-16 pt-4">
      <div className={cn('flex-1 flex flex-col')}>
        <div className="mb-auto flex-1">
          <header className="space-y-4 pb-4">
            <div className="mb-4">
              <PageTitle className="mb-2 mt-6">{post.title}</PageTitle>
              {post.description && (
                <PostSubtitle>{post.description}</PostSubtitle>
              )}
            </div>
            <PostMetadata site={site} post={post} />
            <PostActions post={post} />
          </header>
          <div className="pt-2 md:pt-4">
            <div className="">
              <ContentRender content={post.content} />
            </div>
          </div>
        </div>

        {series?.seriesType === SeriesType.BOOK && (
          <Footer className="mt-auto" site={site} />
        )}
      </div>
      {series?.seriesType === SeriesType.BOOK && (
        <Toc
          content={post.content}
          className="sticky top-20 py-10 xl:block overflow-y-auto w-56 hidden pl-6"
          style={{
            height: 'calc(100vh - 4rem)',
          }}
        />
      )}
    </div>
  )
}
