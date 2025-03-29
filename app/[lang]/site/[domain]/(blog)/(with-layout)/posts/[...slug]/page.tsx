import { PostListProvider } from '@/components/PostListContext'
import { initLingui } from '@/initLingui'
import { getPost, getPosts, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { AppearanceConfig } from '@/lib/theme.types'
import { SitePost } from '@/lib/types'
import { getUrl } from '@/lib/utils'
import { GateType, Post } from '@prisma/client'
import { produce } from 'immer'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import readingTime from 'reading-time'
import { createEditor, Editor, Element, Transforms } from 'slate'
import { PaidContent } from './PaidContent'

type Params = Promise<{ domain: string; slug: string[]; lang: string }>

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

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const site = await getSite(params)
  const slug = decodeURI(params.slug.join('/'))
  const post = await getPost(site.id, slug)

  const title = post?.title || site.seoTitle
  const description = post?.description || site.seoDescription

  const image = post?.image
    ? getUrl(post?.image)
    : 'https://penx.io/opengraph-image'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      // creator: '@zio_penx',
    },
    metadataBase: new URL('https://penx.io'),
  }
}

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

  const slug = decodeURI(params.slug.join('/'))
  const [posts, rawPost] = await Promise.all([
    getPosts(site.id),
    getPost(site.id, slug),
  ])

  if (!rawPost) {
    return notFound()
  }

  let backLinkPosts: Post[] = []

  for (const post of posts) {
    if (post.id === rawPost.id) continue
    const content = JSON.parse(post.content || '[]')
    const editor = createEditor()
    editor.children = content
    for (const nodeEntry of Editor.nodes(editor, {
      at: [],
      match: (node) => {
        return Element.isElement(node) && node.type === 'bidirectional_link'
      },
    })) {
      const [node] = nodeEntry
      if ((node as any).postId === rawPost.id) {
        const find = backLinkPosts.find((p) => p.id === post.id)
        if (!find) backLinkPosts.push(post)
      }
    }
  }

  const post = produce(rawPost, (draft) => {
    if (!lang) return draft
    if (!(draft.i18n as any)?.[lang]) return draft
    draft.title = (draft.i18n as any)?.[lang]?.title
    draft.description = (draft.i18n as any)?.[lang]?.description
    draft.content = (draft.i18n as any)?.[lang]?.content
    return draft
  })

  const postIndex = posts.findIndex((p) => p.slug === slug)
  // if (postIndex === -1 || !post) {

  const prev = posts[postIndex + 1]!
  const next = posts[postIndex - 1]!

  const { PostDetail } = loadTheme(site.themeName)
  if (!PostDetail) throw new Error('Missing PostDetail component')

  // console.log('=====post:', post)

  /** No gated */
  if (post?.gateType == GateType.FREE) {
    return (
      <PostListProvider
        posts={posts as any}
        backLinkPosts={backLinkPosts as any}
      >
        <PostDetail
          site={site}
          post={{
            ...post,
            content: getContent(post),
            readingTime: readingTime(post.content),
          }}
          readable
          next={next}
          prev={prev}
        />
      </PostListProvider>
    )
  }

  return (
    <PostListProvider posts={posts as any} backLinkPosts={backLinkPosts as any}>
      <PaidContent
        site={site}
        postId={post.id}
        post={post}
        next={next}
        prev={prev}
      />
    </PostListProvider>
  )
}
