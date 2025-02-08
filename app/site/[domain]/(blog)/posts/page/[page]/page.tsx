import { POSTS_PER_PAGE } from '@/lib/constants'
import { getPosts, getSite } from '@/lib/fetchers'
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
    title: `Blog | ${site.name}`,
    description: site.description,
  }
}

export const generateStaticParams = async () => {
  const site = await prisma.site.findFirst()
  const posts = site ? await getPosts(site.id) : []
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }))

  return paths
}

export default async function Page({
  params,
}: {
  params: { page: string; domain: string }
}) {
  const site = await getSite(params)
  const posts = await getPosts(site.id)

  const pageNumber = parseInt(params.page as string)
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
