import { getPosts, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { Metadata } from 'next'

const POSTS_PER_PAGE = Number(process.env.NEXT_PUBLIC_POSTS_PAGE_SIZE || 20)

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

export default async function Page({ params }: { params: { domain: string } }) {
  const [posts, site] = await Promise.all([getPosts(), getSite(params)])
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
