import { getPost, getPosts, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import prisma from '@/lib/prisma'
import { GateType, Post } from '@prisma/client'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import readingTime from 'reading-time'
import { PaidContent } from './PaidContent'

function getContent(post: Post) {
  try {
    const content = JSON.parse(post.content || '[]')
    return content
  } catch (error) {
    return post.content
  }
}

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
  const posts = site ? await getPosts(site.id) : []
  return posts.map((post) => ({ slug: [post.slug] }))
}

export default async function Page({
  params,
}: {
  params: { domain: string; slug: string[] }
}) {
  const slug = decodeURI(params.slug.join('/'))
  const site = await getSite(params)
  const posts = await getPosts(site.id)
  const post = await getPost(site.id, slug)

  const postIndex = posts.findIndex((p) => p.slug === slug)
  // if (postIndex === -1 || !post) {
  if (!post) {
    return notFound()
  }

  const prev = posts[postIndex + 1]
  const next = posts[postIndex - 1]

  const { PostDetail } = loadTheme(site.themeName)
  if (!PostDetail) throw new Error('Missing PostDetail component')

  // console.log('=====post:', post)

  /** No gated */
  if (post?.gateType == GateType.FREE) {
    return (
      <>
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
      </>
    )
  }

  return <PaidContent postId={post.id} post={post} next={next} prev={prev} />
}
